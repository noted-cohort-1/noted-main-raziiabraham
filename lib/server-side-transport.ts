import {
  DefaultChatTransport,
  type UIMessage,
  type UIMessageChunk,
  type ChatRequestOptions,
} from "ai";

/**
 * Server-side transport for AI requests.
 * Extends DefaultChatTransport to add authentication headers
 * while reusing the SDK's stream parsing logic.
 */
export class ServerSideTransport<UI_MESSAGE extends UIMessage>
  extends DefaultChatTransport<UI_MESSAGE> {
  private getAuthToken: () => Promise<string | null>;

  constructor(getAuthToken: () => Promise<string | null>) {
    super({ api: "/api/ai/chat" });
    this.getAuthToken = getAuthToken;
  }

  async sendMessages(
    options: {
      trigger: "submit-message" | "regenerate-message";
      chatId: string;
      messageId: string | undefined;
      messages: UI_MESSAGE[];
      abortSignal: AbortSignal | undefined;
    } & ChatRequestOptions
  ): Promise<ReadableStream<UIMessageChunk>> {
    const token = await this.getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    // Merge auth header with existing headers
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    return super.sendMessages({ ...options, headers });
  }
}
