import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { User } from '@prisma/client';
import { CreateContactRequest, ContactResponse } from '../model/contact.model';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  // Logic buat create contact
  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.info(
      `ContactService.create(${user.username}, ${JSON.stringify(request)})`,
    );
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    ) as CreateContactRequest;

    const contact = await this.prismaService.contact.create({
      data: {
        ...createRequest,
        ...{ username: user.username },
      },
    });

    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name ?? undefined,
      email: contact.email ?? undefined,
      phone: contact.phone ?? undefined,
    };
  }

  // Logic buat get contact
  async get(user: User, contactId: number): Promise<ContactResponse> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        username: user.username,
        id: contactId,
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name ?? undefined,
      email: contact.email ?? undefined,
      phone: contact.phone ?? undefined,
    };
  }
}
