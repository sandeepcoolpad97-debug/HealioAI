import { userRoutes } from './user.routes';

export { userRoutes };
export { UserService } from './user.service';
export { UserRepository } from './user.repository';
export { UserModel, IUser } from './user.model';
export type {
  CreateUserInput,
  UpdateUserInput,
} from './user.validation';
