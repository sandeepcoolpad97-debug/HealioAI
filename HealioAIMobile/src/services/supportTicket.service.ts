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

export type SupportTicketStatus = 'open' | 'in_progress' | 'closed';
export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicketAttachmentDto {
  _id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  folder?: string;
  originalFilename?: string;
  tags?: string[];
}

export interface SupportTicketDto {
  _id: string;
  ticketId: string;
  subject: string;
  description: string;
  category: string;
  subCategory: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  lastUpdatedAt?: string;
  createdAt?: string;
   attachments?: SupportTicketAttachmentDto[];
}

export interface ListSupportTicketsParams {
  page?: number;
  limit?: number;
  raisedById?: string;
  raisedByRole?: 'User' | 'Clinic' | 'Lab' | 'Admin';
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  assignedToId?: string;
  category?: string;
  search?: string;
}

export interface ListSupportTicketsResult {
  success: boolean;
  data: SupportTicketDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateSupportTicketPayload {
  raisedByRole: 'User' | 'Clinic' | 'Lab' | 'Admin';
  raisedById: string;
  subject: string;
  description: string;
  category: string;
  subCategory: string;
  priority?: SupportTicketPriority;
  reference?: {
    refType?: 'Appointment' | 'Payment' | 'LabOrder' | 'Prescription' | 'General';
    refId?: string | null;
  };
  attachments?: string[];
}

export interface CreateSupportTicketResult {
  success: boolean;
  data: SupportTicketDto;
}

export const supportTicketService = {
  async listTickets(params: ListSupportTicketsParams = {}): Promise<ListSupportTicketsResult> {
    const query = new URLSearchParams();

    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.raisedById) query.append('raisedById', params.raisedById);
    if (params.raisedByRole) query.append('raisedByRole', params.raisedByRole);
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    if (params.assignedToId) query.append('assignedToId', params.assignedToId);
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);

    const url = `${getApiUrl('/support-tickets')}${
      query.toString() ? `?${query.toString()}` : ''
    }`;

    const res = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    return handleResponse<ListSupportTicketsResult>(res);
  },

  async getTicketById(id: string): Promise<{ success: boolean; data: SupportTicketDto }> {
    const url = getApiUrl(`/support-tickets/${id}`);
    const res = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });
    return handleResponse<{ success: boolean; data: SupportTicketDto }>(res);
  },

  async getTicketByTicketId(ticketId: string): Promise<{ success: boolean; data: SupportTicketDto }> {
    const url = getApiUrl(`/support-tickets/ticket/${ticketId}`);
    const res = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });
    return handleResponse<{ success: boolean; data: SupportTicketDto }>(res);
  },

  async createTicket(payload: CreateSupportTicketPayload): Promise<CreateSupportTicketResult> {
    const url = getApiUrl('/support-tickets');
    const res = await fetch(url, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<CreateSupportTicketResult>(res);
  },
};

