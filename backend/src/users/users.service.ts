import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './user.schema';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.model.findOne({ username }).exec();
  }

  async create(username: string, password: string, roles: UserRole[] = ['user']): Promise<UserDocument> {
    const existing = await this.findByUsername(username);
    if (existing) throw new ConflictException(`User "${username}" already exists`);

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const created = new this.model({ username, password: hashed, roles });
    return created.save();
  }

  async validatePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
