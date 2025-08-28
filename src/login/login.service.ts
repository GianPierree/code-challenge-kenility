import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginUserDto): Promise<string> {
    try {
      const user = await this.usersService.validateUserByEmail(data.email);
      if (!user) {
        this.logger.error(`User not found with email: ${data.email}`);
        throw new UnauthorizedException('User not found');
      }

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        this.logger.error(`Password does not match for user: ${data.email}`);
        throw new UnauthorizedException('Password does not match');
      }

      const payload = {
        email: user.email,
      };

      const token = await this.jwtService.signAsync(payload);

      return token;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error.message);
    }
  }
}
