import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const CurrentClient = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new InternalServerErrorException(
        'User not found, please try again later',
      );
    }
    return user;
  },
);
