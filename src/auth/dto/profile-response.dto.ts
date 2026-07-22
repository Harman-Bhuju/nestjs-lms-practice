import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/user/enum/user.enum";

export class ProfileResponseDto {
    @ApiProperty({
        example: 1,
    })
    id!: number;

    @ApiProperty({
        example: 'John',
    })
    firstName!: string;

    @ApiProperty({
        example: 'Doe',
    })
    lastName!: string;
    @ApiProperty({
        example: 'johndoe@gmail.com',
    })
    email!: string;

    @ApiProperty({
        enum: Role,
        example: Role.STUDENT,
    })
    role!: Role;
}