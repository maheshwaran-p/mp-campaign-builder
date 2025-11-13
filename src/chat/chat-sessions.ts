import { Content } from "@google/genai";
import { v4 as uuid } from "uuid";
import { FormState } from "src/models/form-state";
export interface SessionState {
  id: string;
  state: Partial<FormState>;
  history: Content[];
}
export type Role = "user" | "agent";
/**
 * ChatSessions is a class that manages the state of the chat sessions.
 */
export class ChatSessions {
  private sessions: Map<string, SessionState>;

  constructor() {
    this.sessions = new Map();
  }

  getSession(sessionId: string): SessionState | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Create a new session
   * @param role - The role of the sender ( User or Assistant )
   * @param message - The message from the Sender
   * @returns The session state
   */
  createSession(message: string, customId?: string): SessionState {
    const id = customId || uuid();
    const newSession: SessionState = {
      id,
      state: {},
      history: [
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
    };
    this.sessions.set(id, newSession);
    return newSession;
  }

  /**
   * Update the session
   * @param sessionId - The session id
   * @param role - The role of the Sender (User or Assistant)
   * @param message - The message from the Sender
   * @returns The session state
   */
  addMessage(sessionId: string, role: Role, message: string): SessionState {
    let session = this.getSession(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        state: {},
        history: [
          {
            role,
            parts: [{ text: message }],
          },
        ],
      };

      this.sessions.set(sessionId, session);
    } else {
      session.history.push({
        role,
        parts: [{ text: message }],
      });
    }
    return session;
  }
}
