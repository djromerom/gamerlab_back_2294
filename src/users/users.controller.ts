import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';




@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Get()
  getUsers() {
    return this.usersService.getUsers();

  }



}