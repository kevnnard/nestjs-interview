import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Admin } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayloadInterface } from '../interfaces/jwtPayload.interface';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly auhtService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * @description Validate user payload from JWT token and emit event to validate user in the system and return the payload.
   */
  async validate(payload: JwtPayloadInterface): Promise<Admin> {
    return await this.auhtService.handleValidateUserEvent(payload);
  }
}
