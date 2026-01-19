import { BadRequestException } from '@nestjs/common';

export function validateUniqueSectionTypes(sections: any[]) {
  if (!Array.isArray(sections)) {
    return;
  }

  const types = new Set<string>();
  
  for (const section of sections) {
    if (section && typeof section === 'object' && typeof section.type === 'string') {
      if (types.has(section.type)) {
        throw new BadRequestException(`Duplicate section type found: ${section.type}. Each section type must be unique.`);
      }
      types.add(section.type);
    }
  }
}
