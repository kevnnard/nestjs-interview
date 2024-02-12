import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { JwtPayloadInterface } from '../auth/interfaces/jwtPayload.interface';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  // This method is used to validate the user payload from the JWT token and emit an event to validate the user in the system. It returns the payload.
  async validateClient(payload: JwtPayloadInterface) {
    const user = await this.prisma.client.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (user) return user;
  }
}
