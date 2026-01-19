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
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto, UpdatePortfolioDto } from './dto/portfolio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) { }

  // Public endpoint - Get portfolio by slug (for viewing)
  @Get('public')
  async getPublicPortfolio(@Query('slug') slug: string, @Query('name') name: string) {
    const portfolio = await this.portfoliosService.findBySlug(slug, name);

    // Only return published portfolios to public
    if (!portfolio.published) {
      throw new Error('Portfolio not found');
    }

    return portfolio;
  }

  // Check slug availability
  @Get('check-slug')
  async checkSlug(@Query('slug') slug: string) {
    return this.portfoliosService.checkSlugAvailability(slug);
  }

  // Protected endpoints - require authentication
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createDto: CreatePortfolioDto) {
    return this.portfoliosService.create(req.user.id, createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.portfoliosService.findAllByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const portfolio = await this.portfoliosService.findById(id);

    // Users can only access their own portfolios
    if (portfolio.userId !== req.user.id) {
      throw new Error('Portfolio not found');
    }

    return portfolio;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdatePortfolioDto,
  ) {
    return this.portfoliosService.update(id, req.user.id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.portfoliosService.delete(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  async togglePublish(@Param('id') id: string, @Request() req) {
    return this.portfoliosService.togglePublish(id, req.user.id);
  }
}
