import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.deleteContact();
    await this.prismaService.user.deleteMany({
      where: {
        username: 'alilatukau',
      },
    });
  }

  async getUser(): Promise<User | null> {
    return this.prismaService.user.findUnique({
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
        token: 'testtoken',
      },
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'alilatukau',
      },
    });
  }

  async getContact() {
    return this.prismaService.contact.findFirst({
      where: {
        username: 'alilatukau',
      },
    });
  }

  async createContact() {
    await this.prismaService.contact.create({
      data: {
        username: 'alilatukau',
        first_name: 'Ali',
        last_name: 'Latukau',
        email: 'alilatukau@example.com',
        phone: '081234567890',
      },
    });
  }
}
