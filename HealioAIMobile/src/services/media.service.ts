import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

export interface MediaDto {
  _id: string;
  publicId: string;
  url: string;
  secureUrl?: string;
  resourceType?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  folder?: string;
  originalFilename?: string;
  tags?: string[];
  context?: Record<string, unknown>;
  ownerType?: string;
  ownerId?: string;
  description?: string;
}

export interface UploadMediaPayload {
  uri: string;
  name: string;
  type: string;
  folder?: string;
  ownerType?: string;
  ownerId?: string;
  tags?: string[];
  description?: string;
  context?: Record<string, unknown>;
}

export interface UploadMediaResult {
  success: boolean;
  data: MediaDto;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await firebaseAuth.currentUser?.getIdToken();
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

export const mediaService = {
  async uploadMedia(payload: UploadMediaPayload): Promise<UploadMediaResult> {
    const form = new FormData();

    form.append('file', {
      uri: payload.uri,
      name: payload.name,
      type: payload.type,
    } as any);

    if (payload.folder) form.append('folder', payload.folder);
    if (payload.ownerType) form.append('ownerType', payload.ownerType);
    if (payload.ownerId) form.append('ownerId', payload.ownerId);
    if (payload.tags) {
      payload.tags.forEach((t) => {
        form.append('tags', t);
      });
    }
    if (payload.description) form.append('description', payload.description);
    if (payload.context) form.append('context', JSON.stringify(payload.context));

    const headers = await getAuthHeader();

    const res = await fetch(getApiUrl('/media'), {
      method: 'POST',
      headers,
      body: form,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = (data as any)?.message || res.statusText;
      throw new Error(message);
    }

    return data as UploadMediaResult;
  },
};

