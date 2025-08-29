import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
  generateCode(prefix: string): string {
    console.log(prefix);
    return `${prefix}${Math.floor(100000 + Math.random() * 900000).toString()}`;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
