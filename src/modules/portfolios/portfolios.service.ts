import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Status } from 'generated/prisma/client';

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) { }

  async createPortfolio(userId: string, createDto: CreatePortfolioDto) {
    const portfolio = await this.prisma.portfolio.create({
      data: {
        name: createDto.name,
        slug: createDto.slug,
        theme: createDto.theme || {},
        sections: createDto.sections || [],
        published: createDto.published || false,
        metaTitle: createDto.metaTitle,
        metaDescription: createDto.metaDescription,
        userId,
      },
    });
    return  portfolio;
  }

  async findAllPortfoliosByUser(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findPortfolioById(id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id, deletedAt: null },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return portfolio;
  }

  async findPortfolioBySlug(slug: string, name: string) {
      const portfolio = await this.prisma.portfolio.findFirst({
        where: { name, slug, deletedAt: null },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    await this.prisma.portfolio.update({
      where: { id: portfolio.id, deletedAt: null },
      data: { views: { increment: 1 } },
    });

    return portfolio;
  }

  async updatePortfolio(id: string, userId: string, updateDto: UpdatePortfolioDto) {

      const updatedPortfolio = await this.prisma.portfolio.update({
      where: { id, deletedAt: null },
      data: {
        ...(updateDto.name && { name: updateDto.name }),
        ...(updateDto.slug && { slug: updateDto.slug }),
        ...(updateDto.theme !== undefined && { theme: updateDto.theme }),
        ...(updateDto.sections !== undefined && { sections: updateDto.sections }),
        ...(updateDto.published !== undefined && { published: updateDto.published }),
        ...(updateDto.metaTitle !== undefined && { metaTitle: updateDto.metaTitle }),
        ...(updateDto.metaDescription !== undefined && { metaDescription: updateDto.metaDescription }),
      },
      });
    return updatedPortfolio;
  }

  async deletePortfolio(id: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id, deletedAt: null },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this portfolio');
    }

    return this.prisma.portfolio.update({
      where: { id, deletedAt: null },
      data: { status: Status.DELETED, deletedAt: new Date() },
    });
  }

  async togglePublish(id: string, userId: string) {
    const portfolio = await this.findPortfolioById(id);
    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this portfolio');
    }
    return this.prisma.portfolio.update({
      where: { id: portfolio.id, deletedAt: null },
      data: { published: !portfolio.published },
    });
  }
}
