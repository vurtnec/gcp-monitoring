import {Controller, Get, Provider} from '@nestjs/common';
import { AppService } from './app.service';
import {} from "@willsoto/nestjs-prometheus";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly provider: Provider
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  getTest(): string {
    return 'test';
  }
}
