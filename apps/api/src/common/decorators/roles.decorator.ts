import { SetMetadata } from '@nestjs/common';
import { type UserRole } from '@toeic-master/shared-types';

export const ROLES_KEY = 'roles';

/**
 * @Roles(...roles) decorator — declares which RBAC roles can access a route
 * Usage: @Roles(UserRole.ADMIN, UserRole.CONTENT_EDITOR)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() decorator — marks a route as publicly accessible (no JWT required)
 * Usage: @Public() on controller methods
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
