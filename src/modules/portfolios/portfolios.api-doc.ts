import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

export const portfolioResponseExampleData = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'My Portfolio',
  slug: 'my-portfolio',
  published: true,
  status: 'ACTIVE',
  theme: { primary: '#000000', secondary: '#FFFFFF' },
  sections: [
    { type: 'hero', title: 'My Portfolio', description: 'Welcome to my work' },
  ],
  metaTitle: 'My Portfolio',
  metaDescription: 'A showcase of my projects',
  favicon: null,
  views: 42,
  userId: 'user-uuid-here',
  createdAt: '2025-02-14T10:00:00.000Z',
  updatedAt: '2025-02-14T12:00:00.000Z',
  deletedAt: null,
};

export const portfolioResponseExample = {
  statusCode: 200,
  message: 'Operation successfully!',
  data: portfolioResponseExampleData,
  timestamp: '2025-02-14T12:00:00.000Z',
};

const listPortfoliosExample = {
  statusCode: 200,
  message: 'Operation successfully!',
  data: [portfolioResponseExampleData],
  timestamp: '2025-02-14T12:00:00.000Z',
};

const findOneExample = {
  ...portfolioResponseExample,
  user: {
    id: 'user-uuid-here',
    name: 'Jane Doe',
    email: 'jane@example.com',
  },
};

const deleteExample = {
  ...portfolioResponseExample,
  status: 'DELETED',
  deletedAt: '2025-02-14T12:00:00.000Z',
};

const togglePublishExample = { ...portfolioResponseExample, published: true };

/** Swagger decorators for GET /portfolios/public */
export const ApiGetPublicPortfolioDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get public portfolio by slug and name',
      description:
        'Returns a published portfolio by slug and name. Increments view count. No auth required.',
    }),
    ApiQuery({
      name: 'slug',
      description: 'URL-friendly portfolio identifier',
      example: 'my-portfolio',
    }),
    ApiQuery({
      name: 'name',
      description: 'Portfolio name (unique with slug)',
      example: 'My Portfolio',
    }),
    ApiResponse({
      status: 200,
      description: 'Portfolio found and returned',
      schema: { example: portfolioResponseExample },
    }),
  );

/** Swagger decorators for POST /portfolios */
export const ApiCreatePortfolioDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new portfolio',
      description: 'Creates a portfolio for the authenticated user.',
    }),
    ApiBody({
      type: CreatePortfolioDto,
      examples: {
        minimal: {
          summary: 'Minimal (name + slug only)',
          value: { name: 'My Portfolio', slug: 'my-portfolio' },
        },
        full: {
          summary: 'Full payload',
          value: {
            name: 'My Portfolio',
            slug: 'my-portfolio',
            theme: { primary: '#000000', secondary: '#FFFFFF' },
            sections: [
              {
                type: 'hero',
                title: 'My Portfolio',
                description: 'My Portfolio Description',
              },
            ],
            published: false,
            metaTitle: 'My Portfolio',
            metaDescription: 'My Portfolio Description',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Portfolio created successfully',
      schema: { example: portfolioResponseExample },
    }),
  );

/** Swagger decorators for GET /portfolios */
export const ApiFindAllPortfoliosDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'List my portfolios',
      description: 'Returns all portfolios for the authenticated user.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of portfolios',
      schema: { example: listPortfoliosExample },
    }),
  );

/** Swagger decorators for GET /portfolios/:id */
export const ApiFindOnePortfolioDoc = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'Get portfolio by ID',
      description:
        'Returns a single portfolio by ID if it belongs to the current user.',
    }),
    ApiParam({
      name: 'id',
      description: 'Portfolio UUID',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    ApiResponse({
      status: 200,
      description: 'Portfolio found',
      schema: { example: findOneExample },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Portfolio not found' }),
  );

/** Swagger decorators for PATCH /portfolios/:id */
export const ApiUpdatePortfolioDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update portfolio',
      description: 'Updates a portfolio. Only provided fields are updated.',
    }),
    ApiParam({
      name: 'id',
      description: 'Portfolio UUID',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    ApiBody({
      type: UpdatePortfolioDto,
      examples: {
        updateName: {
          summary: 'Update name only',
          value: { name: 'Updated Portfolio Name' },
        },
        publish: {
          summary: 'Publish portfolio',
          value: { published: true },
        },
        themeAndMeta: {
          summary: 'Update theme and meta',
          value: {
            theme: { primary: '#1a1a1a', secondary: '#f5f5f5' },
            metaTitle: 'New Meta Title',
            metaDescription: 'New meta description',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Portfolio updated successfully',
      schema: { example: portfolioResponseExample },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Portfolio not found' }),
  );

/** Swagger decorators for DELETE /portfolios/:id */
export const ApiDeletePortfolioDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete portfolio',
      description: 'Soft-deletes a portfolio (sets deletedAt).',
    }),
    ApiParam({
      name: 'id',
      description: 'Portfolio UUID',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    ApiResponse({
      status: 200,
      description:
        'Portfolio soft-deleted successfully (returns updated portfolio with status DELETED)',
      schema: { example: deleteExample },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Portfolio not found' }),
  );

/** Swagger decorators for PATCH /portfolios/:id/publish */
export const ApiTogglePublishPortfolioDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Toggle portfolio publish state',
      description: 'Flips the published flag (true → false or false → true).',
    }),
    ApiParam({
      name: 'id',
      description: 'Portfolio UUID',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    ApiResponse({
      status: 200,
      description: 'Publish state toggled',
      schema: { example: togglePublishExample },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Portfolio not found' }),
  );
