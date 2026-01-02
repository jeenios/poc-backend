import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'alilatukau',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'alilatukau',
        password: await bcrypt.hash('testpassword', 10),
        name: 'Ali Latukau',
      },
    });
  }
}
