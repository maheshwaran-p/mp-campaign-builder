import { Injectable } from '@nestjs/common';

@Injectable()
export class DemographicsToolService {
  getAgeTargets(): string[] {
    return [
      "Adult 18+", "Adult 18-24", "Adult 18-34", "Adult 18-44", "Adult 18-49", 
      "Adult 18-54", "Adult 18-64", "Adult 21+", "Adult 21-24", "Adult 21-34", 
      "Adult 21-44", "Adult 21-49", "Adult 21-54", "Adult 21-64", "Adult 25+", 
      "Adult 25-34", "Adult 25-44", "Adult 25-49", "Adult 25-54", "Adult 25-64", 
      "Adult 35+", "Adult 35-44", "Adult 35-49", "Adult 35-54", "Adult 35-64", 
      "Adult 45+", "Adult 45-49", "Adult 45-54", "Adult 45-64", "Adult 55+", 
      "Adult 55-65", "Adult 65+", "All Persons"
    ];
  }
}
