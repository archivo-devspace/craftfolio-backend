import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  root(@Res() res: any): void {
    res.sendFile(join(process.cwd(), 'public', 'index.html'));
  }
}
