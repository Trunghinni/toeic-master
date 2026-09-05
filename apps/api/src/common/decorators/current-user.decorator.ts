import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';

/**
 * @CurrentUser() decorator — extracts the authenticated user from the request
 * Usage: @CurrentUser() user: UserFromJwt
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
