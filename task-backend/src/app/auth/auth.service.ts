import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/entities/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
}
