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
import { ApiTags } from '@nestjs/swagger';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiGetPublicPortfolioDoc,
  ApiCreatePortfolioDoc,
  ApiFindAllPortfoliosDoc,
  ApiFindOnePortfolioDoc,
  ApiUpdatePortfolioDoc,
  ApiDeletePortfolioDoc,
  ApiTogglePublishPortfolioDoc,
} from './portfolios.api-doc';

@ApiTags('portfolios')
@Controller('portfolios')
@UseGuards(JwtAuthGuard)
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Public()
  @Get('public')
  @ApiGetPublicPortfolioDoc()
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
  @ApiCreatePortfolioDoc()
  async create(@Request() req, @Body() createDto: CreatePortfolioDto) {
    return this.portfoliosService.createPortfolio(req.user.id, createDto);
  }

  @Get()
  @ApiFindAllPortfoliosDoc()
  async findAll(@Request() req) {
    return this.portfoliosService.findAllPortfoliosByUser(req.user.id);
  }

  @Get(':id')
  @ApiFindOnePortfolioDoc()
  async findOne(@Param('id') id: string, @Request() req) {
    const portfolio = await this.portfoliosService.findPortfolioById(id);

    if (portfolio.userId !== req.user.id) {
      throw new Error('Portfolio not found');
    }

    return portfolio;
  }

  @Patch(':id')
  @ApiUpdatePortfolioDoc()
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdatePortfolioDto,
  ) {
    return this.portfoliosService.updatePortfolio(id, req.user.id, updateDto);
  }

  @Delete(':id')
  @ApiDeletePortfolioDoc()
  async delete(@Param('id') id: string, @Request() req) {
    return this.portfoliosService.deletePortfolio(id, req.user.id);
  }

  @Patch(':id/publish')
  @ApiTogglePublishPortfolioDoc()
  async togglePublish(@Param('id') id: string, @Request() req) {
    return this.portfoliosService.togglePublish(id, req.user.id);
  }
}
