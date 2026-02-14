import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

const authResponseExample = {
  statusCode: 201,
  message: 'Operation successfully!',
  data : {
  user: {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
  },
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  }
}


@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and returns user info with JWT access token.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: { example: authResponseExample },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Authenticates with email and password, returns user info and JWT access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: { example: authResponseExample },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current user (me)',
    description:
      'Returns the authenticated user id, email, and name. Requires valid JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    schema: {
      example: {
        statusCode: 200,
        message: 'Operation successfully!',
        data: {
          email: 'jane.doe@example.com',
          name: 'Jane Doe',
          avatarUrl: null,
          status: 'ACTIVE',
          id: 'b8ad06ea-71dd-4188-b479-c6573cc914f6',
          createdAt: '2026-02-14T11:18:22.438Z',
          updatedAt: '2026-02-14T11:18:22.438Z',
          deletedAt: null,
        },
      },
    },
  })
  async getMe(@Request() req) {
    return this.authService.getMe(req.user.id);
  }
}
