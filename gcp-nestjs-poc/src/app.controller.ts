import {Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';
import {InjectMetric} from "@willsoto/nestjs-prometheus";
import {Histogram} from "prom-client";

@Controller()
export class AppController {
  constructor(
      @InjectMetric("http_request_duration_seconds") public histogram: Histogram<any>,
      private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    const end = this.histogram.startTimer()

    end({route: '/test222'})

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
