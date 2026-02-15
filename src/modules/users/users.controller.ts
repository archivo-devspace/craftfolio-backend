import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiGetProfileDoc, ApiUpdateProfileDoc } from './users.api-doc';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiGetProfileDoc()
  async getProfile(@Request() req) {
    return await this.usersService.findUserById(req.user.id);
  }

  @Patch('profile')
  @ApiUpdateProfileDoc()
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
