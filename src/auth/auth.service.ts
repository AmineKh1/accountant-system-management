import { Injectable, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
const bcrypt = require("bcrypt");
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<Omit<User, "password">> {
    const user = await this.usersService.findOne({
      email
    });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User, @Res() res: Response) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = await this.jwtService.sign(payload);
    res.cookie('access_token', String(access_token), {
      maxAge: 1000 * 60 * 60 * 4,
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      secure: true,
      timestamp: true,
    })
    res.send(
      access_token,
    );
  }

}