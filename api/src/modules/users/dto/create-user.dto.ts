export class CreateUserDto {
  last_name: string;
  first_name: string;
  middle_name?: string;
  login: string;
  password: string;
  role_id: number;
} 