import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { Role } from './enum/user.enum';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(registerUserDto: RegisterDto) {

    const newUser = this.userRepository.create({
      firstName: registerUserDto.firstName,
      lastName: registerUserDto.lastName,
      email: registerUserDto.email,
      password: registerUserDto.password,
    })

    try {
      const savedUser = await this.userRepository.save(newUser)

      return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
      }
    }
    catch (err: unknown) {
      const e = err as {code?: string};

      const DUPLICATE_KEY_CODE = '23505';

      if(e.code === DUPLICATE_KEY_CODE){
        throw new ConflictException('Email is already taken');
      }

      throw err;

    }
  }

  async getUser(id: number, email: string, role: Role){
    return await this.userRepository.findOne({
      where: {
          id,
          email,
          role,
      },
    })
  }

  async findByEmail(email: string){
    return await this.userRepository.findOne({
      where: {
        email,
      },
    })
  }

  async findById(id: number){
    return await this.userRepository.findOne({
      where: {id}
    })
  }

  async updateRefreshToken(id: number, refreshToken: string | null){
    await this.userRepository.update(id, {
      refreshToken,
    });
  }


}
