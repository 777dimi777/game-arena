import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  const user = this.userRepository.create({
    username: createUserDto.username,
    email: createUserDto.email,
    password: hashedPassword,
    role: createUserDto.role ?? 'USER',
  });

  return this.userRepository.save(user);
}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
  const user = await this.findOne(id);

  if (updateUserDto.password) {
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
  }

  Object.assign(user, updateUserDto);

  return this.userRepository.save(user);
}

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.userRepository.remove(user);
  }
}