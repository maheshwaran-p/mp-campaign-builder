import { Injectable } from '@nestjs/common';
import { AudienceToolService } from './audience-tool.service';
import { ToolCallRequest, ToolCallResponse } from '../tool.interface';

@Injectable()
export class AudienceTool {
  constructor(private readonly audienceToolService: AudienceToolService) {}

  async execute(request: ToolCallRequest): Promise<ToolCallResponse> {
    const { action, id } = request.parameters;

    if (action === 'getAllSegments') {
      const segments = this.audienceToolService.getAllSegments();
      return {
        tool: 'audience',
        result: {
          action,
          segments
        }
      };
    }
    
    if (action === 'getSegmentById' && id) {
      const segment = this.audienceToolService.getSegmentById(id);
      return {
        tool: 'audience',
        result: {
          action,
          segment
        }
      };
    }

    throw new Error(`Action "${action}" is not supported by audience tool`);
  }
}
