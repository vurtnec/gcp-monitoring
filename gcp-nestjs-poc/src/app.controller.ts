import {Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';
import {} from "@willsoto/nestjs-prometheus";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService
  ) {}

  @Get()
  getHello(test: string): string {
    return this.appService.getHello();
  }

  @Get('/test')
  getTest(): string {
    return 'test';
  }

  @Get('/test1')
  getTes1(): string {
    return this.appService.getHello();
  }
}
