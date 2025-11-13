
import { DemographicsTool } from './demographics/demographics.tool';
import { AudienceTool } from './audience/audience.tool';
import { GeographyTool } from './geography/geography.tool';
import { ToolCallRequest, ToolCallResponse } from './tool.interface';

export function createToolRegistry(
  demographicsTool: DemographicsTool,
  audienceTool: AudienceTool,
  geographyTool: GeographyTool
): Record<string, { execute: (req: ToolCallRequest) => Promise<ToolCallResponse> }> {
  return {
    demographics: demographicsTool,
    audience: audienceTool,
    geography: geographyTool
  };
}
