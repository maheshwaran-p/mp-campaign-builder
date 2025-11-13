import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';
import { FormState } from "src/models/form-state";
import { Content } from "@google/genai";

const MACRO_USER_MESSAGE = '%%USER_MESSAGE%%';
const MACRO_CURRENT_FORM_STATE = '%%CURRENT_FORM_STATE%%';
const MACRO_CHAT_HISTORY = '%%CHAT_HISTORY%%';
const MACRO_TOOL_REGISTRY = '%%TOOL_REGISTRY%%';
const MACRO_DEMOGRAPHICS_TOOL_PROMPT = '%%DEMOGRAPHICS_TOOL_PROMPT%%';
const MACRO_AUDIENCE_TOOL_PROMPT = '%%AUDIENCE_TOOL_PROMPT%%';
const MACRO_GEOGRAPHY_TOOL_PROMPT = '%%GEOGRAPHY_TOOL_PROMPT%%';

@Injectable()
export class PromptsService {
  private systemPrompt: string;
  private userPrompt: string;
  private toolRegistryPrompt: string;
  private demographicsToolPrompt: string;
  private audienceToolPrompt: string;
  private geographyToolPrompt: string;

  constructor() {
    const promptsDir = __dirname;
    this.systemPrompt = fs.readFileSync(path.join(promptsDir, "system-prompt.txt"),"utf8");
    this.userPrompt = fs.readFileSync(path.join(promptsDir, "user-prompt.txt"),"utf8");
    this.toolRegistryPrompt = fs.readFileSync(path.join(promptsDir, "tool-call-prompts.txt"),"utf8");
    this.demographicsToolPrompt = fs.readFileSync(path.join(promptsDir, "tool-prompts/demographics.txt"),"utf8");
    this.audienceToolPrompt = fs.readFileSync(path.join(promptsDir, "tool-prompts/audience.txt"),"utf8");
    this.geographyToolPrompt = fs.readFileSync(path.join(promptsDir, "tool-prompts/geography.txt"),"utf8");
  }

  getSystemPrompt(): string {
    return this.systemPrompt;
  }

  getUserPrompt(userMessage: string, currentFormState: Partial<FormState>, chatHistory: Content[]): string {
    let toolRegistryWithPrompts = this.toolRegistryPrompt
      .replace(MACRO_DEMOGRAPHICS_TOOL_PROMPT, this.demographicsToolPrompt)
      .replace(MACRO_AUDIENCE_TOOL_PROMPT, this.audienceToolPrompt)
      .replace(MACRO_GEOGRAPHY_TOOL_PROMPT, this.geographyToolPrompt);
    
    return this.userPrompt
      .replace(MACRO_TOOL_REGISTRY, toolRegistryWithPrompts)
      .replace(MACRO_USER_MESSAGE, userMessage)
      .replace(MACRO_CURRENT_FORM_STATE, JSON.stringify(currentFormState))
      .replace(MACRO_CHAT_HISTORY, JSON.stringify(chatHistory));
  }

  getTotalPrompt(userMessage: string, currentFormState: Partial<FormState>, chatHistory: Content[]): string {
    return this.systemPrompt + this.getUserPrompt(userMessage, currentFormState, chatHistory);
  }
}
