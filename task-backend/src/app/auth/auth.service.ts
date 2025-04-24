import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignDTO } from 'src/core/dto/auth.dto';
import { User } from 'src/core/entities/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Method for token generation
   *
   * @private
   * @param {User} user - User data.
   * @returns string - Authorization token.
   */
  private async generateToken(user: User): Promise<string> {
    const token = await this.jwtService.signAsync({
      id: user._id,
      email: user.email,
    });

    return token;
  }

  /**
   * Method for user authorization
   *
   * @public
   * @param {SignDTO} dto - Email and password.
   * @returns string - Authorization tokens.
   */
  async login({ email, password }: SignDTO): Promise<string> {
    try {
      const findUser = await this.usersModel.findOne({ email });

      if (!findUser)
        throw new HttpException('User no found', HttpStatus.NOT_FOUND);

      const isAuth = await bcrypt.compare(password, findUser.password);

      if (!isAuth)
        throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);

      const token = await this.generateToken(findUser);

      return token;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error during user login',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Method for user registration
   *
   * @public
   * @param {SignDTO} reg - Registration details.
   * @returns string - Authorization tokens.
   */
  async registration(dto: SignDTO): Promise<string> {
    try {
      const emailExist = await this.usersModel.findOne({ email: dto.email });

      if (emailExist)
        throw new HttpException('Email is already taken', HttpStatus.CONFLICT);

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = await this.usersModel.create({
        ...dto,
        password: hashedPassword,
      });

      if (!newUser)
        throw new HttpException(
          'Error in creating a user',
          HttpStatus.BAD_REQUEST,
        );

      const token = this.generateToken(newUser);

      return token;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error during user registration',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Google login or registration
   *
   * @public
   * @param {string} email - User email.
   * @returns string - Authorization tokens.
   */
  async googleLogin(googleUser: { email: string }): Promise<string> {
    try {
      let user = await this.usersModel.findOne({ email: googleUser.email });

      if (!user) {
        user = await this.usersModel.create({
          email: googleUser.email,
          password: null,
        });
      }

      return await this.generateToken(user);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error during Google login',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
