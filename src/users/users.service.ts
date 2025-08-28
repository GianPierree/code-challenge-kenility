import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { PREFIX } from 'src/common/common.constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly commonService: CommonService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    try {
      const user = new this.userModel({
        ...createUserDto,
        password: await this.commonService.hashPassword(createUserDto.password),
        code: this.commonService.generateCode(PREFIX.USER),
      });
      const result = await user.save();

      return result.code;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find({}, { password: 0 }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }, { password: 0 }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async validateUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
