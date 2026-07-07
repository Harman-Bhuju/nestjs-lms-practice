import { Role } from "src/user/enum/user.enum";

export interface AuthenticatedUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
}