import { FormState } from "src/models/form-state";

export interface ChatRequestDto {
  message: string;
  sessionId?: string;
  fields?: FormState;
}


