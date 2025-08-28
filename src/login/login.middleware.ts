import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JWT_SECRET } from 'src/common/common.constants';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoginMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: () => void) {
    const resquest = req.headers['authorization'];
    const token = resquest ? resquest.split(' ')[1] : null

    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    try {
      const tokenValidate: { email: string } = this.jwtService.verify(token, {
        secret: JWT_SECRET
      })

      req['user'] = tokenValidate.email;

    } catch (error) {
      this.logger.error('Token invalid ', error);
      throw new UnauthorizedException('Token invalid ', error)
    }

    next();
  }
}