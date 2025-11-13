import { Injectable } from '@nestjs/common';
import { FormState } from 'src/models/form-state';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatSessions, SessionState } from './chat-sessions'        
import { Logger } from '@nestjs/common';
import { PromptsService } from 'src/prompts/prompts.service';
import { GeminiService } from 'src/llm/gemini.service';
import { diff } from 'json-diff-ts';
import { DemographicsTool } from 'src/tools/demographics/demographics.tool';
import { AudienceTool } from 'src/tools/audience/audience.tool';
import { GeographyTool } from 'src/tools/geography/geography.tool';
import { ToolCallRequest, ToolCallResponse } from 'src/tools/tool.interface';
import { createToolRegistry } from 'src/tools/tools';
import { Observable } from 'rxjs';
import { SSEEventType } from './sse-events';
@Injectable()
export class ChatService {
  private chatSessions: ChatSessions;
  private promptsService: PromptsService;
  private geminiService: GeminiService;
  private toolRegistry: Record<string, { execute: (req: ToolCallRequest) => Promise<ToolCallResponse> }>;
  
  /**
   * Helper method to merge states and calculate changes
   * @param currentState - Current state (old state)
   * @param newStateData - New state data to merge
   * @returns Object containing merged state and only the changed fields
   */
  private mergeStateAndGetChanges(
    currentState: Partial<FormState> | undefined,
    newStateData: Partial<FormState> | undefined
  ): {
    mergedState: Partial<FormState>;
    changes: Partial<FormState>;
  } {
    const oldState: Partial<FormState> = currentState || {};
    const newState: Partial<FormState> = this.sanitizeDates(newStateData || {});
    // merging both the old and new states!
    const mergedState: Partial<FormState> = { ...oldState, ...newState };
    const changeset = diff(oldState, mergedState);
    // collect only changed fields
    const changes: Partial<FormState> = {};
    for (const c of changeset) {
      if (c.type === 'ADD' || c.type === 'UPDATE') {
        changes[c.key] = mergedState[c.key as keyof FormState]!;
      } else if (c.type === 'REMOVE') {
        changes[c.key] = null as any;
      }
    }
    
    return { mergedState, changes };
  }


  private sanitizeDates(state: Partial<FormState>): Partial<FormState> {
    const sanitized = { ...state };
  
    if (sanitized.startDate && typeof sanitized.startDate === 'string') {
      const match = sanitized.startDate.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
        sanitized.startDate = match[1];
      }
    }
    
    if (sanitized.endDate && typeof sanitized.endDate === 'string') {
      const match = sanitized.endDate.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
        sanitized.endDate = match[1];
      }
    }
    
    return sanitized;
  }

  constructor(
    promptsService: PromptsService,
    geminiService: GeminiService,
    private readonly demographicsTool: DemographicsTool,
    private readonly audienceTool: AudienceTool,
    private readonly geographyTool: GeographyTool
  ) {
    this.chatSessions = new ChatSessions();
    this.promptsService = promptsService;
    this.geminiService = geminiService;

    this.toolRegistry = createToolRegistry(this.demographicsTool, this.audienceTool, this.geographyTool);
  }

  getOrCreateSession(sessionId: string | undefined, message: string): SessionState {
    if (sessionId) {
      const existingSession = this.chatSessions.getSession(sessionId);
      if (existingSession) {
        return existingSession;
      }
      Logger.log(`Session with id ${sessionId} not found. Creating new session`);
      // If sessionId is provided but not found, create a new session with that id
      const newSession = this.chatSessions.createSession(message, sessionId);
      return newSession;
    } else {
      Logger.log('No session id provided. Creating new session');
      const newSession = this.chatSessions.createSession(message);
      return newSession;
    }
  }
  /**
   * Process the message from the user
   * @param request - The request from the user
   * @returns The response from the server
   */
  async processMessage(request: ChatRequestDto): Promise<ChatResponseDto> {
    let session: SessionState | undefined;
    try {
      session = this.getOrCreateSession(request?.sessionId, request.message);
      const prompt = this.promptsService.getTotalPrompt(
        request.message,
        session.state,
        session.history,
      );
      const response = await this.geminiService.generateResponse(prompt);
      this.chatSessions.addMessage(session.id, 'user', request.message);
      this.chatSessions.addMessage(session.id, 'agent', JSON.stringify(response));
      const { mergedState, changes } = this.mergeStateAndGetChanges(session.state, response.state);
      session.state = mergedState;
      if (response.action && response.action.type === 'tool_call' && response.action.tool_call) {
        const toolName = String(response.action.tool_call.tool).toLowerCase();
        const toolInstance = this.toolRegistry[toolName];
        if (toolInstance) {
          let toolParams = {
            ...response.action.tool_call.parameters,
            ...(session.state || {}),
          };
          const toolRequest: ToolCallRequest = {
            tool: toolName,
            parameters: toolParams,
          };
          this.chatSessions.addMessage(session.id, 'agent', JSON.stringify({
            type: 'tool_call',
            tool: toolName,
            parameters: toolRequest.parameters
          }));
          const toolResult = await toolInstance.execute(toolRequest);
          this.chatSessions.addMessage(session.id, 'agent', JSON.stringify({
            type: 'tool_result',
            tool: toolName,
            result: toolResult.result
          }));
          return {
            sessionId: session.id,
            message: response.message,
            state: session.state,
            changes,
            action: {
              type: 'tool_call',
              tool_call: toolRequest
            },
            tool_result: toolResult.result
          };
        } else {
          Logger.warn(`Tool not found: ${toolName}`);
        }
      }
      return {
        sessionId: session.id,
        message: response.message,
        state: session.state,
        changes,
      };
    } catch (error) {
      Logger.error(`[ChatService] Error: ${error}`);
      return {
        message:
          'An error occurred while processing your request. Please try again.',
        state: {},
        changes: {},
      };
    }
  }
  /**
   * Process the upload from the user
   * @param files - The files from the user
   * @returns The response from the server
   */
  async processUpload(
    request: ChatRequestDto,
    files: Array<Express.Multer.File>,
  ): Promise<ChatResponseDto> {
    return {
      sessionId: request?.sessionId,
      message: `Hello from Upload - ${request.sessionId} - ${files?.length} files`,
      state: {},
      changes: {},
    };
  }

  /**
   * Stream chat messages using Server-Sent Events
   */
  streamMessage(query: { sessionId: string; message: string }): Observable<MessageEvent> {
    return new Observable(observer => {
      this.processStreamingMessage(query, observer).catch(error => {
        Logger.error(`[ChatService] Stream error: ${error}`);
        observer.next({
          data: JSON.stringify({
            type: SSEEventType.ERROR,
            data: { message: 'Error processing request', error: error.message },
            sessionId: query.sessionId || 'unknown'
          })
        } as MessageEvent);
        observer.complete();
      });
    });
  }

  private async processStreamingMessage(
    query: { sessionId: string; message: string },
    observer: any
  ): Promise<void> {
    try {
      console.log('DEBUG: Incoming SSE query:', query);
      const session = this.getOrCreateSession(query.sessionId, query.message);
      const prompt = this.promptsService.getTotalPrompt(
        query.message,
        session.state,
        session.history,
      );

      // Add user message to history
      this.chatSessions.addMessage(session.id, 'user', query.message);

      // Getting initial LLM response
      const response = await this.geminiService.generateResponse(prompt);
      
      // Add LLM response to history
      this.chatSessions.addMessage(session.id, 'agent', JSON.stringify(response));

      const { mergedState, changes } = this.mergeStateAndGetChanges(session.state, response.state);
      session.state = mergedState;

      // Send initial response
      observer.next({
        data: JSON.stringify({
          type: SSEEventType.INITIAL_RESPONSE,
          data: {
            message: response.message,
            state: session.state,
            changes
          },
          sessionId: session.id
        })
      } as MessageEvent);

      // Check for tool calls
      if (response.action && response.action.type === 'tool_call' && response.action.tool_call) {
        const toolName = String(response.action.tool_call.tool).toLowerCase();
        const toolInstance = this.toolRegistry[toolName];

        if (toolInstance) {
          let toolParams = {
            ...response.action.tool_call.parameters,
            ...(session.state || {}),
          };

          const toolRequest: ToolCallRequest = {
            tool: toolName,
            parameters: toolParams,
          };

          // Send tool call event
          observer.next({
            data: JSON.stringify({
              type: SSEEventType.TOOL_CALL,
              data: {
                tool: toolName,
                parameters: toolRequest.parameters
              },
              sessionId: session.id
            })
          } as MessageEvent);

          // Execute tool
          const toolResult = await toolInstance.execute(toolRequest);

          // Send tool result event
          observer.next({
            data: JSON.stringify({
              type: SSEEventType.TOOL_RESULT,
              data: {
                tool: toolName,
                result: toolResult.result
              },
              sessionId: session.id
            })
          } as MessageEvent);

          // Process tool result with LLM
          const toolPrompt = `Tool result for ${toolName}: ${JSON.stringify(toolResult.result)}\n\n${query.message}`;
          const finalPrompt = this.promptsService.getTotalPrompt(
            toolPrompt,
            session.state,
            session.history,
          );

          const finalResponse = await this.geminiService.generateResponse(finalPrompt);
          
          // Add final response to history
          this.chatSessions.addMessage(session.id, 'agent', JSON.stringify(finalResponse));

          const { mergedState: finalMergedState, changes: finalChanges } = this.mergeStateAndGetChanges(session.state, finalResponse.state);
          session.state = finalMergedState;

          let finalMessage = finalResponse.message;
          if (finalMessage && response.message && finalMessage.trim().toLowerCase() === response.message.trim().toLowerCase()) {
            finalMessage = `I've processed the ${toolName} information and updated the campaign details accordingly.`;
            Logger.log(`[ChatService] Duplicate message detected. Replacing with standard message.`);
          }

          // Send final response event
          observer.next({
            data: JSON.stringify({
              type: SSEEventType.FINAL_RESPONSE,
              data: {
                message: finalMessage,
                state: session.state,
                changes: finalChanges,
                toolCall: toolRequest,
                toolResult: toolResult.result
              },
              sessionId: session.id
            })
          } as MessageEvent);

        } else {
          Logger.warn(`Tool not found: ${toolName}`);
          observer.next({
            data: JSON.stringify({
              type: SSEEventType.ERROR,
              data: { message: `Tool '${toolName}' not found` },
              sessionId: session.id
            })
          } as MessageEvent);
        }
      }

      // Send done event
      observer.next({
        data: JSON.stringify({
          type: SSEEventType.DONE,
          data: null,
          sessionId: session.id
        })
      } as MessageEvent);

      observer.complete();

    } catch (error) {
      Logger.error(`[ChatService] Stream error: ${error}`);
      observer.next({
        data: JSON.stringify({
          type: SSEEventType.ERROR,
          data: { message: 'Error processing request', error: error.message },
          sessionId: query.sessionId || 'unknown'
        })
      } as MessageEvent);
      observer.complete();
    }
  }
}