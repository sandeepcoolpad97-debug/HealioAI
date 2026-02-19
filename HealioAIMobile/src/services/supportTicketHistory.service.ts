import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await firebaseAuth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as any)?.message || res.statusText;
    throw new Error(message);
  }
  return data as T;
}

export type SupportTicketHistoryAction =
  | 'created'
  | 'user_reply'
  | 'agent_reply'
  | 'status_changed'
  | 'priority_changed'
  | 'category_changed'
  | 'assigned'
  | 'closed'
  | 'reopened';

export interface SupportTicketHistoryAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface SupportTicketHistoryEntry {
  _id: string;
  ticketId: string;
  action: SupportTicketHistoryAction | string;
  message?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  performedByRole: string;
  performedById?:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        clinicName?: string;
        labName?: string;
        emailId?: string;
      }
    | null;
  attachments?: SupportTicketHistoryAttachment[];
  createdAt?: string;
}

export interface ListHistoryForTicketResult {
  success: boolean;
  data: SupportTicketHistoryEntry[];
}

export const supportTicketHistoryService = {
  async getHistoryForTicket(ticketId: string, page?: number, limit?: number): Promise<ListHistoryForTicketResult> {
    const query = new URLSearchParams();
    if (page) query.append('page', String(page));
    if (limit) query.append('limit', String(limit));

    const url = `${getApiUrl(`/support-ticket-history/ticket/${ticketId}`)}${
      query.toString() ? `?${query.toString()}` : ''
    }`;

    const res = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    return handleResponse<ListHistoryForTicketResult>(res);
  },
};

