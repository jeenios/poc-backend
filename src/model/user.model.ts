export class RegisterModelRequest {
  username: string;
  password: string;
  name: string;
}

export class UserResponse {
  name: string;
  username: string;
  token?: string;
}
