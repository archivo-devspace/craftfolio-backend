import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto, UpdatePortfolioDto } from './dto/portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, createDto: CreatePortfolioDto) {
    // Check if slug is already taken
    const existing = await this.prisma.portfolio.findUnique({
      where: { slug: createDto.slug },
    });

    if (existing) {
      throw new ConflictException('This slug is already taken');
    }

    return this.prisma.portfolio.create({
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
  }

  async findAllByUser(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found 555>>>');
    }

    return portfolio;
  }

  async findBySlug(slug: string, name: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { slug, name },
      include: { user: { select: { id: true, name: true } } },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found >>>');
    }

    // Increment view count
    await this.prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { views: { increment: 1 } },
    });

    return portfolio;
  }

  async update(id: string, userId: string, updateDto: UpdatePortfolioDto) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found 34>>>');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this portfolio');
    }

    // Check if slug is being changed and if new slug is available
    if (updateDto.slug && updateDto.slug !== portfolio.slug) {
      const existing = await this.prisma.portfolio.findUnique({
        where: { slug: updateDto.slug },
      });

      if (existing) {
        throw new ConflictException('This slug is already taken');
      }
    }

    return this.prisma.portfolio.update({
      where: { id },
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
  }

  async delete(id: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this portfolio');
    }

    return this.prisma.portfolio.delete({
      where: { id },
    });
  }

  async togglePublish(id: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this portfolio');
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: { published: !portfolio.published },
    });
  }

  async checkSlugAvailability(slug: string) {
    const existing = await this.prisma.portfolio.findUnique({
      where: { slug },
    });
    return { available: !existing };
  }
}
