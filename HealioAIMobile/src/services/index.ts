export {
  confirmPhoneOtp,
  formatPhoneE164,
  getCurrentUser,
  sendPhoneOtp,
  signInWithGoogle,
  signOut,
} from './auth.service';

export {
  listRoles,
  listSubscriptionPlans,
  getFreeSubscriptionId,
  loginUser,
  loginAsUserOrClinicOrLab,
  onboardUser,
  loginClinic,
  createClinic,
  loginLab,
  createLab,
  type RoleDto,
  type SubscriptionDto,
  type LoginUserPayload,
  type OnboardUserPayload,
  type LoginClinicPayload,
  type CreateClinicPayload,
  type LoginLabPayload,
  type CreateLabPayload,
  type LoginEntityType,
  type LoginAsUserOrClinicOrLabResult,
} from './api.service';

export { reviewService, type ReviewDto, type CreateReviewPayload } from './review.service';

export {
  supportTicketService,
  type SupportTicketDto,
  type SupportTicketAttachmentDto,
  type ListSupportTicketsParams,
  type ListSupportTicketsResult,
  type CreateSupportTicketPayload,
  type CreateSupportTicketResult,
} from './supportTicket.service';

export {
  mediaService,
  type MediaDto,
  type UploadMediaPayload,
  type UploadMediaResult,
} from './media.service';

export {
  supportTicketHistoryService,
  type SupportTicketHistoryEntry,
  type ListHistoryForTicketResult,
} from './supportTicketHistory.service';
