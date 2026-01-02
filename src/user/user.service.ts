import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  RegisterUserRequest,
  LoginUserRequest,
  UserResponse,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
  ) {}
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(
        UserValidation.REGISTER,
        request,
      ) as RegisterUserRequest;

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

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`Login user ${JSON.stringify(request)}`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    ) as LoginUserRequest;

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });
    if (!user) {
      throw new HttpException('Username and password is invalid', 400);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Username and password is invalid', 400);
    }

    user = await this.prismaService.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuidv4(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token!,
    };
  }
}
