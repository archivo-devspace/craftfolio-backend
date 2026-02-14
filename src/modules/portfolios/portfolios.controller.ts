import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

const portfolioResponseExampleData = 
{
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
  }

const portfolioResponseExample = {
  statusCode: 200,
  message: 'Operation successfully!',
  data: portfolioResponseExampleData,
  timestamp: '2025-02-14T12:00:00.000Z',
}

@ApiTags('portfolios')
@Controller('portfolios')
@UseGuards(JwtAuthGuard)
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Public()
  @Get('public')
  @ApiOperation({
    summary: 'Get public portfolio by slug and name',
    description:
      'Returns a published portfolio by slug and name. Increments view count. No auth required.',
  })
  @ApiQuery({
    name: 'slug',
    description: 'URL-friendly portfolio identifier',
    example: 'my-portfolio',
  })
  @ApiQuery({
    name: 'name',
    description: 'Portfolio name (unique with slug)',
    example: 'My Portfolio',
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio found and returned',
    schema: { example: portfolioResponseExample },
  })
  async getPublicPortfolio(
    @Query('slug') slug: string,
    @Query('name') name: string,
  ) {
    const portfolio = await this.portfoliosService.findPortfolioBySlug(
      slug,
      name,
    );
    if (!portfolio.published) {
      throw new NotFoundException('Portfolio not published');
    }

    return portfolio;
  }


  @Post()
  @ApiOperation({
    summary: 'Create a new portfolio',
    description: 'Creates a portfolio for the authenticated user.',
  })
  @ApiBody({
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
  })
  @ApiResponse({
    status: 201,
    description: 'Portfolio created successfully',
    schema: { example: portfolioResponseExample },
  })
  async create(@Request() req, @Body() createDto: CreatePortfolioDto) {
    return this.portfoliosService.createPortfolio(req.user.id, createDto);
  }


  @Get()
  @ApiOperation({
    summary: 'List my portfolios',
    description: 'Returns all portfolios for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of portfolios',
    schema: {
      example: {
        statusCode: 200,
        message: 'Operation successfully!',
        data: [portfolioResponseExampleData],
        timestamp: '2025-02-14T12:00:00.000Z',
      },
    },
  })
  async findAll(@Request() req) {
    return this.portfoliosService.findAllPortfoliosByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Get(':id')
  @ApiOperation({
    summary: 'Get portfolio by ID',
    description:
      'Returns a single portfolio by ID if it belongs to the current user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Portfolio UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio found',
    schema: {
      example: {
        ...portfolioResponseExample,
        user: {
          id: 'user-uuid-here',
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const portfolio = await this.portfoliosService.findPortfolioById(id);

    if (portfolio.userId !== req.user.id) {
      throw new Error('Portfolio not found');
    }

    return portfolio;
  }


  @Patch(':id')
  @ApiOperation({
    summary: 'Update portfolio',
    description: 'Updates a portfolio. Only provided fields are updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Portfolio UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({
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
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio updated successfully',
    schema: { example: portfolioResponseExample },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdatePortfolioDto,
  ) {
    return this.portfoliosService.updatePortfolio(id, req.user.id, updateDto);
  }


  @Delete(':id')
  @ApiOperation({
    summary: 'Delete portfolio',
    description: 'Soft-deletes a portfolio (sets deletedAt).',
  })
  @ApiParam({
    name: 'id',
    description: 'Portfolio UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description:
      'Portfolio soft-deleted successfully (returns updated portfolio with status DELETED)',
    schema: {
      example: {
        ...portfolioResponseExample,
        status: 'DELETED',
        deletedAt: '2025-02-14T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.portfoliosService.deletePortfolio(id, req.user.id);
  }


  @Patch(':id/publish')
  @ApiOperation({
    summary: 'Toggle portfolio publish state',
    description: 'Flips the published flag (true → false or false → true).',
  })
  @ApiParam({
    name: 'id',
    description: 'Portfolio UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Publish state toggled',
    schema: {
      example: { ...portfolioResponseExample, published: true },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async togglePublish(@Param('id') id: string, @Request() req) {
    return this.portfoliosService.togglePublish(id, req.user.id);
  }
}
