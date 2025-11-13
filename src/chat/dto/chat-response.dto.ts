import { FormState } from "src/models/form-state";
import { ToolCallRequest, ToolCallResponse } from "src/tools/tool.interface";

export interface ChatResponseDto {
  sessionId?: string;
  message: string;
  state?: FormState;
  changes?: Partial<FormState>;
  action?: {
    type: 'tool_call';
    tool_call: ToolCallRequest;
  } | {
    type: 'tool_result';
    tool_result: ToolCallResponse;
  };
  tool_result?: ToolCallResponse;
}