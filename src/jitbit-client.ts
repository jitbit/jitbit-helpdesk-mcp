export interface TicketSummary {
  IssueID: number;
  Subject: string;
  Status: string;
  Priority: string;
  CategoryName: string;
  SubmitterUserName: string;
  AssigneeUserName: string;
  DateCreated: string;
  DateUpdated: string;
}

export interface TicketComment {
  CommentID: number;
  Body: string;
  UserName: string;
  DateCreated: string;
  IsHidden: boolean;
}

export interface TicketDetails {
  IssueID: number;
  Subject: string;
  Body: string;
  Status: string;
  Priority: string;
  CategoryName: string;
  SubmitterUserName: string;
  AssigneeUserName: string;
  DateCreated: string;
  DateUpdated: string;
  Tags: string[];
  Comments: TicketComment[];
}

export class JitbitClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = token;
  }

  private async request<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}/api${endpoint}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      switch (response.status) {
        case 401:
          throw new Error("Authentication failed. Check that your JITBIT_TOKEN is valid.");
        case 403:
          throw new Error("Permission denied. Your account may not have access to this resource.");
        case 404:
          throw new Error("Resource not found. Check that the ID is correct.");
        case 429:
          throw new Error("Rate limit exceeded. Please wait before making more requests.");
        default:
          throw new Error(`API request failed (${response.status}): ${text || response.statusText}`);
      }
    }

    return response.json() as Promise<T>;
  }

  async searchTickets(query: string, limit: number, offset: number): Promise<TicketSummary[]> {
    return this.request<TicketSummary[]>("/Search", {
      query,
      count: limit,
      offset,
    });
  }

  async listTickets(mode?: string, status?: string, limit?: number, offset?: number): Promise<TicketSummary[]> {
    return this.request<TicketSummary[]>("/Tickets", {
      mode,
      statuses: status,
      count: limit,
      offset,
    });
  }

  async getTicket(ticketId: number): Promise<TicketDetails> {
    return this.request<TicketDetails>("/Ticket", { id: ticketId });
  }
}
