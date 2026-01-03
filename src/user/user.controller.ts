import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  RegisterUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
} from '../model/user.model';
import { WebModelResponse } from '../model/web.model';
import { UserResponse } from '../model/user.model';
import { Auth } from '../middleware/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  // Register new user
  @Post()
  @HttpCode(200)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebModelResponse<UserResponse>> {
    const result = await this.userService.register(request);
    return {
      data: result,
    };
  }

  // Login user
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebModelResponse<UserResponse>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }

  // Get user profile
  @Get('/current')
  @HttpCode(200)
  async get(@Auth() user: User): Promise<WebModelResponse<UserResponse>> {
    const result = await this.userService.get(user);
    return {
      data: result,
    };
  }

  // Update user profile
  @Patch('/current')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<WebModelResponse<UserResponse>> {
    const result = await this.userService.update(user, request);
    return {
      data: result,
    };
  }

  // Logout user
  @Delete('/current')
  @HttpCode(200)
  async logout(@Auth() user: User): Promise<WebModelResponse<boolean>> {
    await this.userService.logout(user);
    return {
      data: true,
    };
  }
}
