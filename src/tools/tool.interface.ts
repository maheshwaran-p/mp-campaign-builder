export interface ToolCallRequest {
  tool: string;
  parameters: Record<string, any>;
}

export interface ToolCallResponse {
  tool: string;
  result: any;
}
