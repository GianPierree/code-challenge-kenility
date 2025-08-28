import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginService } from 'src/login/login.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loginService: LoginService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return {
      success: true,
      message: 'User created successfully',
      user_code: result,
    };
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      message: 'Users found successfully',
      users,
    };
  }

  @Get(':email')
  async findOneByEmail(@Param('email') email: string) {
    const user = await this.usersService.findOneByEmail(email);
    return {
      success: true,
      message: 'User found successfully',
      user,
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.loginService.login(loginUserDto);
    return {
      success: true,
      message: 'User logged in successfully',
      token: result,
    };
  }
}
