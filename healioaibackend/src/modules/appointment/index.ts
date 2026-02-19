import { appointmentRoutes } from './appointment.routes';

export { appointmentRoutes };
export { AppointmentService } from './appointment.service';
export { AppointmentRepository } from './appointment.repository';
export { AppointmentModel, IAppointment } from './appointment.model';
export type {
  CreateAppointmentInput,
  RescheduleAppointmentInput,
  CancelAppointmentInput,
} from './appointment.validation';
