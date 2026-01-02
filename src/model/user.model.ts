export class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
}

export class UserResponse {
  name: string;
  username: string;
  token?: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}
