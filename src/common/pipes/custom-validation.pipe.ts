import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const result = errors.reduce<Record<string, string>>((acc, error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : ['Unknown validation error'];
          acc[error.property] = constraints[0];
          return acc;
        }, {});

        return new BadRequestException({ message: result });
      },
    });
  }
}
