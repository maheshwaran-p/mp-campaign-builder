import { Injectable } from '@nestjs/common';
import { ToolCallRequest, ToolCallResponse } from '../tool.interface';
import { DemographicsToolService } from './demographics-tool.service';

@Injectable()
export class DemographicsTool {
  constructor(private readonly demographicsToolService: DemographicsToolService) {}

  async execute(request: ToolCallRequest): Promise<ToolCallResponse> {

    const { action, userInput } = request.parameters;
    const ageTargets = this.demographicsToolService.getAgeTargets();

    if (action === 'getAgeTargets') {
      // If userInput is provided, we match it to the closest age target
      let matchedTarget: string | undefined;
      if (userInput) {
        const normalizedInput = userInput.toLowerCase();
        matchedTarget = ageTargets.find(t => t.toLowerCase() === normalizedInput);
        if (!matchedTarget) {
          matchedTarget = ageTargets.find(t => t.toLowerCase().includes(normalizedInput));
        }
        if (!matchedTarget) {
          matchedTarget = ageTargets[0];
        }
        return {
          tool: 'demographics',
          result: {
            action,
            ageTargets,
            matchedTarget,
            userInput
          }
        };
      }
      return {
        tool: 'demographics',
        result: {
          action,
          ageTargets
        }
      };
    }

    throw new Error(`Action "${action}" is not supported by demographics tool`);
  }
}
