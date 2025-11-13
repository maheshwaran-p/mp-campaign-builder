import { ChatSessions } from "./chat-sessions";

describe('ChatSessions', () => {
  let chatSessions: ChatSessions;

  beforeEach(() => {
    chatSessions = new ChatSessions();
  });

  it('should create a new session', () => {
    const session = chatSessions.createSession('Hello');
    expect(session).toBeDefined();
    expect(session.history.length).toBe(1);
    expect(session.history[0]).toEqual({
      role: 'user',
      parts: [{ text: 'Hello' }],
    });
  });

  it('should add the messages to history', () => {
    const session = chatSessions.createSession('Hello');
    const updatedSession = chatSessions.addMessage(
      session.id,
      'agent',
      'Added Message',
    );
    expect(updatedSession).toBeDefined();
    expect(updatedSession.history.length).toBe(2);
    expect(updatedSession.history[1]).toEqual({
      role: 'agent',
      parts: [{ text: 'Added Message' }],
    });
  });

  it('should create a session with the provided id if it does not exist, and update the history', () => {
    const session = chatSessions.addMessage('test-uid', 'user', 'Hello');
    expect(session).toBeDefined();
    expect(session.history.length).toBe(1);
    expect(session.history[0]).toEqual({
      role: 'user',
      parts: [{ text: 'Hello' }],
    });
  });
});
