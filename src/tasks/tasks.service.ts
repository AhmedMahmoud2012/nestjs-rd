import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {

    }


    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }



    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, user } });
        if (!found) {
            throw new NotFoundException(`Task not found`);
        }
        return found;
    }

    async deleteTask(id: number, user: User): Promise<boolean> {
        const result = await this.taskRepository.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException(`Task Not found`)
        }
        return true;
    }

    async updateTaskStatus(id: number, updateTaskStatus: UpdateTaskStatusDto, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = updateTaskStatus.status;
        await task.save()
        return task;
    }


}
