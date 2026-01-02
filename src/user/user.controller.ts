import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, LoginUserRequest } from '../model/user.model';
import { WebModelResponse } from '../model/web.model';
import { UserResponse } from '../model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

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
}
