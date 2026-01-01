import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(TypeZod: ZodType<T>, data: T) {
    return TypeZod.parse(data);
  }
}
