import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import {InjectMetric} from "@willsoto/nestjs-prometheus";
import {Histogram} from "prom-client";
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(
      @InjectMetric("http_request_duration_seconds") public histogram: Histogram<any>,
      @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
      private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    const end = this.histogram.startTimer()
    // @ts-ignore
    this.logger.info('Calling getHello()', { controller: AppController.name });

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
