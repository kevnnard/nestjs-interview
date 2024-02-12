import { Controller, UseGuards } from '@nestjs/common';
import { JwtClientGuard } from '../auth/guards/client.guard';
import { ClientService } from './client.service';

@UseGuards(JwtClientGuard)
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
}
