import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { Client } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RESPONSES } from './constants/responses';
import { JwtPayloadInterface } from './interfaces/jwtPayload.interface';
import { JwtResponse } from './interfaces/jwtResponse.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description Sign in Client user  and return the user and token.
   * @param payload
   * @returns
   */
  async ClientSignIn(body: {
    email: string;
    password: string;
  }): Promise<JwtResponse> {
    const userExist = await this.prisma.client.findFirst({
      where: {
        email: body.email,
      },
    });
    if (!userExist) throw new UnauthorizedException(RESPONSES.USER_NOT_FOUND);
    const passwordMatch = await bcrypt.compare(
      body.password,
      userExist.password,
    );
    if (!passwordMatch)
      throw new UnauthorizedException(RESPONSES.INVALID_CREDENTIALS);
    return {
      token: this.jwtService.sign({ email: userExist.email, id: userExist.id }),
    };
  }

  /**
   * @
   */

  /**
   * @description Sign in Admin user  and return the user and token.
   * @param payload
   * @returns
   */
  async AdminSignIn(body: {
    email: string;
    password: string;
  }): Promise<JwtResponse> {
    const userExist = await this.prisma.admin.findFirst({
      where: {
        email: body.email,
      },
    });
    if (!userExist) throw new UnauthorizedException(RESPONSES.USER_NOT_FOUND);
    const passwordMatch = await bcrypt.compare(
      body.password,
      userExist.password,
    );
    if (!passwordMatch)
      throw new UnauthorizedException(RESPONSES.INVALID_CREDENTIALS);
    return {
      token: this.jwtService.sign({ email: userExist.email, id: userExist.id }),
    };
  }

  /**
   * @description Create a new user in the system by admin and return the user.
   * @param body
   * @returns
   */
  async adminCreateUser(body: Client): Promise<Client> {
    const userExist = await this.prisma.client.findFirst({
      where: {
        email: body.email,
      },
    });
    if (userExist)
      throw new UnauthorizedException(RESPONSES.USER_ALREADY_EXISTS);
    const user = await this.prisma.client.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        company: body.company,
      },
    });
    return user;
  }

  /**
   * @description Validate user payload from JWT token and emit event to validate user in the system and return the payload.
   * @param payload
   * @returns
   */
  async handleValidateUserEvent(payload: JwtPayloadInterface) {
    const user = await this.prisma.admin.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (user) return user;
  }
}
