import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RegisterModelRequest, UserResponse } from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
  ) {}
  async register(request: RegisterModelRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);
    const registerRequest: RegisterModelRequest =
      this.validationService.validate(
        UserValidation.REGISTER,
        request,
      ) as RegisterModelRequest;

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });
    if (totalUserWithSameUsername !== 0) {
      throw new HttpException('Username already exists', 400);
    }
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    const user = await this.prismaService.user.create({
      data: registerRequest,
    });
    return {
      username: user.username,
      name: user.name,
    };
  }
}
