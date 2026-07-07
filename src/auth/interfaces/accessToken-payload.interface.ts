import { Role } from "src/user/enum/user.enum";

export interface AccessTokenPayload {
  id: number;
  email: string;
  role: Role;
}