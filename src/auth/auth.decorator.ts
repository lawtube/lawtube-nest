/* istanbul ignore file */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if(authHeader == "" || !authHeader){
      return "notvalid"
    }
    const token = authHeader?.split(' ')[1];
    return token;
  },
);