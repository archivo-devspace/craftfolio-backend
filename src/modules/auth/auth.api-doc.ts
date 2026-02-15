import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/** Shared response example for register and login */
export const authResponseExample = {
  statusCode: 201,
  message: 'Operation successfully!',
  data: {
    user: {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
    },
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
};

/** Response example for GET /auth/me */
export const getMeResponseExample = {
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
};

/** Swagger decorators for POST /auth/register */
export const ApiRegisterDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Creates a new user account and returns user info with JWT access token.',
    }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully',
      schema: { example: authResponseExample },
    }),
  );

/** Swagger decorators for POST /auth/login */
export const ApiLoginDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Login',
      description:
        'Authenticates with email and password, returns user info and JWT access token.',
    }),
    ApiResponse({
      status: 200,
      description: 'Login successful',
      schema: { example: authResponseExample },
    }),
  );

/** Swagger decorators for GET /auth/me */
export const ApiGetMeDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get current user (me)',
      description:
        'Returns the authenticated user id, email, and name. Requires valid JWT.',
    }),
    ApiResponse({
      status: 200,
      description: 'Current user info',
      schema: { example: getMeResponseExample },
    }),
  );
