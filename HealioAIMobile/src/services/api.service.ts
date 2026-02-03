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

// ---------- Clinic ----------

export interface LoginClinicPayload {
  firebaseUid: string;
  idToken: string;
  email?: string;
  phone?: { countryCode?: string; number: string };
}

export interface CreateClinicPayload {
  firebaseUid: string;
  clinicName: string;
  registrationNumber: string;
  roleId: string;
  address?: string;
  establishmentDate?: string;
  contactNumber: string;
  emailId?: string;
  operatingHours?: Array<{
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }>;
  specialisation?: string[];
  consultationType?: 'in_person' | 'online' | 'both';
  doctorName: string;
  consents: {
    termsAndConditions: true;
    policyTerms: true;
    medicalDisclaimer: true;
  };
}

export interface ClinicResponse {
  success: boolean;
  data: Record<string, unknown>;
}

/** POST /clinics/login. Returns 404 if clinic not found. */
export async function loginClinic(payload: LoginClinicPayload): Promise<ClinicResponse> {
  const res = await fetch(getApiUrl('/clinics/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<ClinicResponse>(res);
}

/** POST /clinics. Create clinic (onboarding). */
export async function createClinic(payload: CreateClinicPayload): Promise<ClinicResponse> {
  const res = await fetch(getApiUrl('/clinics'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<ClinicResponse>(res);
}

// ---------- Lab ----------

export interface LoginLabPayload {
  firebaseUid: string;
  idToken: string;
  email?: string;
  phone?: { countryCode?: string; number: string };
}

export interface CreateLabPayload {
  firebaseUid: string;
  labName: string;
  registrationNumber: string;
  roleId: string;
  address?: string;
  contactNumber: string;
  emailId?: string;
  operatingHours?: Array<{
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }>;
  services?: {
    testCategories?: string[];
    homeSampleCollection?: boolean;
    reportDeliveryType?: ('pdf' | 'in_app')[];
  };
  consents: {
    termsAndConditions: true;
    policyTerms: true;
    medicalDisclaimer: true;
  };
}

export interface LabResponse {
  success: boolean;
  data: Record<string, unknown>;
}

/** POST /labs/login. Returns 404 if lab not found. */
export async function loginLab(payload: LoginLabPayload): Promise<LabResponse> {
  const res = await fetch(getApiUrl('/labs/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<LabResponse>(res);
}

/** POST /labs. Create lab (onboarding). */
export async function createLab(payload: CreateLabPayload): Promise<LabResponse> {
  const res = await fetch(getApiUrl('/labs'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<LabResponse>(res);
}

export type LoginEntityType = 'user' | 'clinic' | 'lab';

export interface LoginAsUserOrClinicOrLabResult {
  success: true;
  type: LoginEntityType;
  data: Record<string, unknown>;
}

/**
 * Try login in order: user → clinic → lab.
 * Uses same payload shape: firebaseUid, idToken, and either email (Google) or phone (OTP).
 * Returns first successful result; throws with status 404 if none found.
 */
export async function loginAsUserOrClinicOrLab(
  payload: LoginUserPayload
): Promise<LoginAsUserOrClinicOrLabResult> {
  const base = { firebaseUid: payload.firebaseUid, idToken: payload.idToken };
  const userPayload: LoginUserPayload = { ...base, email: payload.email, phone: payload.phone };
  const clinicPayload: LoginClinicPayload = { ...base, email: payload.email, phone: payload.phone };
  const labPayload: LoginLabPayload = { ...base, email: payload.email, phone: payload.phone };

  try {
    const res = await loginUser(userPayload);
    return { success: true, type: 'user', data: (res as LoginUserResponse).data ?? {} };
  } catch (err: unknown) {
    if ((err as { status?: number })?.status !== 404) throw err;
  }
  try {
    const res = await loginClinic(clinicPayload);
    return { success: true, type: 'clinic', data: (res as ClinicResponse).data ?? {} };
  } catch (err: unknown) {
    if ((err as { status?: number })?.status !== 404) throw err;
  }
  try {
    const res = await loginLab(labPayload);
    return { success: true, type: 'lab', data: (res as LabResponse).data ?? {} };
  } catch (err: unknown) {
    throw err;
  }
}
