import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Client } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClientService } from '../../client/client.service';
import { JwtPayloadInterface } from '../interfaces/jwtPayload.interface';

@Injectable()
export class JwtClientStrategy extends PassportStrategy(
  Strategy,
  'client-jwt',
) {
  constructor(
    private readonly clientService: ClientService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // This method is used to validate the user payload from the JWT token and emit an event to validate the user in the system. It returns the payload.
  async validate(payload: JwtPayloadInterface): Promise<Client> {
    return await this.clientService.validateClient(payload);
  }
}
