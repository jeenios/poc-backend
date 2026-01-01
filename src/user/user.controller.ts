import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterModelRequest } from '../model/user.model';
import { WebModelResponse } from '../model/web.model';
import { UserResponse } from '../model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(
    @Body() request: RegisterModelRequest,
  ): Promise<WebModelResponse<UserResponse>> {
    const result = await this.userService.register(request);
    return {
      data: result,
    };
  }
}
