import { IsArray, IsBoolean, IsObject, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePortfolioDto {
  @ApiProperty({
    description: 'The name of the portfolio',
    example: 'My Portfolio',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'The slug of the portfolio',
    example: 'my-portfolio',
  })
  @IsString()
  @MinLength(3)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug: string; 

  @ApiProperty({
    description: 'The theme of the portfolio',
    example: {
      primary: '#000000',
      secondary: '#FFFFFF',
    },
  })
  @IsObject()
  @IsOptional()
  theme?: Record<string, any>;

  @ApiProperty({
    description: 'The sections of the portfolio',
    example: [
      { type: 'hero', title: 'My Portfolio', description: 'My Portfolio Description' },
    ],
  })
  @IsArray()
  @IsOptional()
  sections?: any[];

  @ApiProperty({
    description: 'The published status of the portfolio',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    description: 'The meta title of the portfolio',
    example: 'My Portfolio',
  })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiProperty({
    description: 'The meta description of the portfolio',
    example: 'My Portfolio Description',
  })
  @IsString()
  @IsOptional()
  metaDescription?: string;
}
