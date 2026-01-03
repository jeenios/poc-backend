import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  RegisterUserRequest,
  LoginUserRequest,
  UserResponse,
  UpdateUserRequest,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
  ) {}

  // Logic buat register user
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);
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

  // Logic buat login user
  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`Login user ${JSON.stringify(request)}`);
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

  // Logic buat get user by token
  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }

  // Logic buat update user
  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UPdate user ${JSON.stringify(user)}, ${JSON.stringify(request)}`,
    );

    const updateUserRequest: UpdateUserRequest =
      this.validationService.validate(
        UserValidation.UPDATE,
        request,
      ) as UpdateUserRequest;

    if (updateUserRequest.name) {
      user.name = updateUserRequest.name;
    }

    if (updateUserRequest.password) {
      user.password = await bcrypt.hash(updateUserRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return {
      username: result.username,
      name: result.name,
    };
  }

  // Logic buat logout user
  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });
    return {
      username: result.username,
      name: result.name,
    };
  }
}
