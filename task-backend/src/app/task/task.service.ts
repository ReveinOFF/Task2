import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskDTO } from 'src/core/dto/task.dto';
import { Task } from 'src/core/entities/task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  /**
   * Create a new task and assign users
   * @param createTaskDto - New task data
   * @param userId - User ID
   * @returns Task - Created task
   */
  async createTask(createTaskDto: TaskDTO, userId: string): Promise<Task> {
    const task = await this.taskModel.create({
      ...createTaskDto,
      user: userId,
    });

    return task;
  }

  /**
   * Get all tasks
   * @param userId - User ID
   * @returns Task[] - List of tasks
   */
  async getAllTasks(userId: string): Promise<Task[]> {
    return this.taskModel.find({
      user: userId,
    });
  }

  /**
   * Get a task by ID
   * @param id - Task ID
   * @param userId - User ID
   * @returns Task - The found task
   */
  async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      _id: id,
      user: userId,
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  /**
   * Update a task
   * @param id - Task ID
   * @param updateTaskDto - Task update data
   * @param userId - User ID
   * @returns Task - Updated task
   */
  async updateTask(
    id: string,
    updateTaskDto: TaskDTO,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: id, user: userId },
      { ...updateTaskDto },
    );

    return task as Task;
  }

  /**
   * Delete a task
   * @param id - Task ID
   * @param userId - User ID
   * @returns void
   */
  async deleteTask(id: string, userId: string): Promise<void> {
    const task = await this.taskModel.findOneAndDelete({
      user: userId,
      _id: id,
    });
  }
}
