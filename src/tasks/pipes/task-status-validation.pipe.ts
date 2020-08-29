import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

import { TaskStatus } from '../task.model';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform<string, string> {
  private readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(value: string): string {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is not a valid task status`);
    }

    return value;
  }

  private isStatusValid(value: any): boolean {
    const index = this.allowedStatuses.indexOf(value);
    return index !== -1;
  }
}
