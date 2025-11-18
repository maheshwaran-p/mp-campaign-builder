import { Injectable } from '@nestjs/common';
import { ToolCallRequest, ToolCallResponse } from '../tool.interface';
import { ChannelsToolService } from './channels-tool.service';

@Injectable()
export class ChannelsTool {
  constructor(private readonly channelsToolService: ChannelsToolService) {}

  async execute(request: ToolCallRequest): Promise<ToolCallResponse> {
    console.log('[ChannelsTool] Executing channels tool with action:', request.parameters.action);
    
    const { action } = request.parameters;

    if (action === 'getAllChannels') {
      console.log('[ChannelsTool] Fetching all channel data');
      
      const linearTV = this.channelsToolService.getLinearTVChannels();
      const streamingTV = this.channelsToolService.getStreamingTVChannels();
      const signageLocations = this.channelsToolService.getSignageLocations();

      if (!linearTV || !streamingTV || !signageLocations) {
        console.warn('[ChannelsTool] Channel data not available yet');
        return {
          tool: 'channels',
          result: {
            type: 'error',
            message: 'Channel data is still loading. Please try again in a moment.'
          }
        };
      }

      console.log(`[ChannelsTool] Successfully retrieved ${linearTV.length} Linear TV channels, ${streamingTV.length} Streaming TV channels, and ${signageLocations.length} signage locations`);

      return {
        tool: 'channels',
        result: {
          action,
          linearTV,
          streamingTV,
          signageLocations
        }
      };
    }

    console.error(`[ChannelsTool] Unsupported action: ${action}`);
    throw new Error(`Action "${action}" is not supported by channels tool. Available actions: getAllChannels`);
  }
}
