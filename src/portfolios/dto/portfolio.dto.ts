import { IsString, IsOptional, IsBoolean, IsObject, IsArray, Matches, MinLength } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(3)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @IsObject()
  @IsOptional()
  theme?: Record<string, any>;

  @IsArray()
  @IsOptional()
  sections?: any[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;
}

export class UpdatePortfolioDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(3)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  @IsOptional()
  slug?: string;

  @IsObject()
  @IsOptional()
  theme?: Record<string, any>;

  @IsArray()
  @IsOptional()
  sections?: any[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;
}
