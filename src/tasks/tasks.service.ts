import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto, GetTasksFilterDto } from './dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);

    this.taskRepository.remove(task);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    return this.taskRepository.updateTaskStatus(task, status);
  }
}
