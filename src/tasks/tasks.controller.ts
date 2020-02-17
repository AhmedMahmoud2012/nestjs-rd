import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task.status.validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private tasksService: TasksService) { }

    @Get()
    async getTasks(@Query(TaskStatusValidationPipe, ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        return await this.tasksService.getTasks(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return await this.tasksService.createTask(createTaskDto, user);
    }


    @Get('/:id')
    async getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return await this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    async deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<boolean> {
        return await this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    async updateTasksStatus(@Param('id', ParseIntPipe) id: number, @Body(TaskStatusValidationPipe) updateTaskStatusDto: UpdateTaskStatusDto, @GetUser() user: User): Promise<Task> {
        return await this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user);
    }
}
