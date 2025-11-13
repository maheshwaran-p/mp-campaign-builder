
import { Injectable } from '@nestjs/common';
import { ToolCallRequest, ToolCallResponse } from '../tool.interface';
import { GeographyToolService } from './geography-tool.service';

@Injectable()
export class GeographyTool {
  constructor(private readonly geographyToolService: GeographyToolService) {}

  async execute(request: ToolCallRequest): Promise<ToolCallResponse> {
    const { action } = request.parameters;

    if (action === 'getCoordinates') {
      const location = request.parameters.location || request.parameters.query;
      if (!location) {
        return {
          tool: 'geography',
          result: {
            type: 'error',
            message: 'No location provided. Please specify a location to geocode.'
          }
        };
      }

      const coords = await this.geographyToolService.geocodeLocationGoogle(location);
      const radiusMiles = request.parameters.radiusMiles;
      
      if (!coords) {
        return {
          tool: 'geography',
          result: {
            type: 'error',
            message: `Could not geocode location: "${location}". Please provide a clearer place name.`
          }
        };
      }

      return {
        tool: 'geography',
        result: {
          type: 'coordinates',
          coordinates: coords,
          radiusMiles: radiusMiles,
          message: `Successfully geocoded "${location}" to coordinates: ${coords.latitude}, ${coords.longitude}`
        }
      };
    }

    throw new Error(`Action "${action}" is not supported by geography tool. Available actions: getCoordinates`);
  }
}
