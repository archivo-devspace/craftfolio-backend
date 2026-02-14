import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

const userProfileResponseExample = {
        statusCode: 200,
        message: 'Operation successfully!',
        data: {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          email: 'jane.doe@example.com',
          name: 'Jane Doe',
          avatarUrl: 'https://example.com/avatars/jane.png',
          status: 'ACTIVE',
          createdAt: '2025-02-14T10:00:00.000Z',
          updatedAt: '2025-02-14T10:00:00.000Z',
          deletedAt: null,
        },
}
      
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the authenticated user profile (password excluded).',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: userProfileResponseExample,
    },
  })
  async getProfile(@Request() req) {
    return await this.usersService.findUserById(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update current user profile',
    description:
      'Updates the authenticated user profile. Only provided fields are updated.',
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      updateName: {
        summary: 'Update name only',
        value: { name: 'Jane Smith' },
      },
      updateAvatar: {
        summary: 'Update avatar URL only',
        value: {
          avatarUrl: 'https://example.com/avatars/new-avatar.png',
        },
      },
      updateBoth: {
        summary: 'Update name and avatar',
        value: {
          name: 'Jane Smith',
          avatarUrl: 'https://example.com/avatars/jane-smith.png',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: userProfileResponseExample,
    },
  })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
