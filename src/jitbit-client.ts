export interface TicketSummary {
  IssueID: number;
  Subject: string;
  Status: string;
  Priority: number;
  Category: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  Technician: string;
  IssueDate: string;
  LastUpdated: string;
}

export interface JitbitUserInfo {
  UserID: number;
  Username: string;
  FullName: string;
  FirstName: string;
  LastName: string;
  Email: string;
}

export interface TicketTag {
  TagID: number;
  Name: string;
  TagCount: number;
}

export interface TicketComment {
  CommentID: number;
  Body: string;
  UserName: string;
  CommentDate: string;
  ForTechsOnly: boolean;
}

export interface TicketDetails {
  TicketID: number;
  Subject: string;
  Body: string;
  Status: string;
  Priority: number;
  CategoryName: string;
  SubmitterUserInfo: JitbitUserInfo;
  AssigneeUserInfo: JitbitUserInfo | null;
  AssignedToUserID: number | null;
  IssueDate: string;
  LastUpdated: string;
  Tags: TicketTag[];
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
    const [ticket, comments] = await Promise.all([
      this.request<Omit<TicketDetails, "Comments">>("/Ticket", { id: ticketId }),
      this.request<TicketComment[]>("/Comments", { id: ticketId }),
    ]);
    return { ...ticket, Comments: comments };
  }
}
