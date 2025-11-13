export enum SSEEventType {
  INITIAL_RESPONSE = 'initial_response',
  TOOL_CALL = 'tool_call', 
  TOOL_RESULT = 'tool_result',
  FINAL_RESPONSE = 'final_response',
  ERROR = 'error',
  DONE = 'done'
}

export interface SSEEvent {
  type: SSEEventType;
  data: any;
  sessionId: string;
}
