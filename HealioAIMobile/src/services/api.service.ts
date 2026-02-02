import { getApiUrl } from '../config/api.config';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

async function getAuthHeaders(idToken: string | null): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as { message?: string })?.message ??
      (data as { error?: string })?.error ??
      res.statusText;
    throw Object.assign(new Error(message), {
      status: res.status,
      code: (data as { code?: string })?.code,
    });
  }
  return data as T;
}

export interface RoleDto {
  _id: string;
  name: string;
  description?: string;
  permissions?: string[];
  isSystemRole?: boolean;
}

export interface ListRolesResponse {
  success: boolean;
  data: RoleDto[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

/** List roles. Filter client-side to user, clinic, lab only. */
export async function listRoles(): Promise<RoleDto[]> {
  const res = await fetch(getApiUrl('/roles') + '?page=1&limit=50', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const body = await handleResponse<ListRolesResponse>(res);
  const data = body.data ?? [];
  const allowed = ['user', 'clinic', 'lab'];
  return data.filter((r) => allowed.includes(r.name.toLowerCase()));
}

export interface SubscriptionDto {
  _id: string;
  name: string;
  code: string;
  price: number;
  currency?: string;
  durationInDays?: number;
  features?: string[];
  isSystemPlan?: boolean;
}

export interface ListSubscriptionsResponse {
  success: boolean;
  data: SubscriptionDto[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

/** List subscription plans for onboarding (requires Firebase idToken). */
export async function listSubscriptionPlans(idToken: string): Promise<SubscriptionDto[]> {
  const res = await fetch(getApiUrl('/subscriptions/plans') + '?page=1&limit=50', {
    method: 'GET',
    headers: await getAuthHeaders(idToken),
  });
  const body = await handleResponse<ListSubscriptionsResponse>(res);
  return body.data ?? [];
}

/** Find free plan by code 'free' (or first plan if no free). */
export function getFreeSubscriptionId(plans: SubscriptionDto[]): string | null {
  const free = plans.find((p) => p.code?.toLowerCase() === 'free');
  if (free) return free._id;
  if (plans.length > 0) return plans[0]._id;
  return null;
}

export interface OnboardUserPayload {
  firebaseUid: string;
  name: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  language?: string;
  roleId: string;
  subscriptionId: string;
  email?: string;
  phone: { countryCode?: string; number: string; verified?: boolean };
  consents: {
    termsAndConditions: true;
    policyTerms: true;
    medicalDisclaimer: true;
  };
  medical?: {
    existingConditions?: string[];
    otherConditions?: string;
  };
}

export interface OnboardUserResponse {
  success: boolean;
  data: Record<string, unknown>;
}

/** Login payload: either email (Google) or phone (mobile). */
export interface LoginUserPayload {
  firebaseUid: string;
  idToken: string;
  email?: string;
  phone?: { countryCode?: string; number: string };
}

export interface LoginUserResponse {
  success: boolean;
  data: Record<string, unknown>;
}

/**
 * POST /users/login. For existing users: verify Firebase token and get user from backend.
 * Use email for Google login, phone for mobile number login.
 * Returns 404 if user not found (not onboarded yet).
 */
export async function loginUser(payload: LoginUserPayload): Promise<LoginUserResponse> {
  const res = await fetch(getApiUrl('/users/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<LoginUserResponse>(res);
}

/** POST /users/onboard. Requires Firebase idToken in Authorization. */
export async function onboardUser(
  idToken: string,
  payload: OnboardUserPayload
): Promise<OnboardUserResponse> {
  const res = await fetch(getApiUrl('/users/onboard'), {
    method: 'POST',
    headers: await getAuthHeaders(idToken),
    body: JSON.stringify(payload),
  });
  return handleResponse<OnboardUserResponse>(res);
}
