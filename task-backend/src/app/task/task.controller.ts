import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDTO } from 'src/core/dto/task.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/core/guard/auth.guard';

@Controller('event')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body()
    createTaskDto: TaskDTO,
    @Req() req: Request,
  ) {
    const userId = req.tokenData?.id;

    return this.taskService.createTask(createTaskDto, userId as string);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTasks(@Req() req: Request) {
    const userId = req.tokenData?.id;

    return this.taskService.getAllTasks(userId as string);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTaskById(@Param('id') id: string, @Req() req: Request) {
    const userId = req.tokenData?.id;

    return this.taskService.getTaskById(id, userId as string);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('id') id: string,
    @Body()
    updateTaskDto: TaskDTO,
    @Req() req: Request,
  ) {
    const userId = req.tokenData?.id;

    return this.taskService.updateTask(id, updateTaskDto, userId as string);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTask(@Param('id') id: string, @Req() req: Request) {
    const userId = req.tokenData?.id;

    return this.taskService.deleteTask(id, userId as string);
  }
}
