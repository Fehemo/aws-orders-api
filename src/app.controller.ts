import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
   getHealth() {
     return {
       status: 'ok',
   };
  }

  @Get('api/v1/health')
healthV1() {
  return {
    status: 'ok',
    version: '1.0.0',
  };
}
}
