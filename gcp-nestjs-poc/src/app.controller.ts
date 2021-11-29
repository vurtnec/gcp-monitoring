import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import {InjectMetric} from "@willsoto/nestjs-prometheus";
import {Histogram} from "prom-client";
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as NestLogger, Injectable } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
      @InjectMetric("http_request_duration_seconds") public histogram: Histogram<any>,
      // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
      private readonly appService: AppService
  ) {}

  // @ts-ignore
  private readonly nestLogger = new NestLogger(AppController.name);

  @Get()
  getHello(): string {
    const end = this.histogram.startTimer()
    // @ts-ignore
    // this.logger.info('Calling getHello() 1111', { controller: AppController.name });
    // this.logger.info('Calling getHello() 1111');
    // this.logger.info(`Calling getHello() 1111 ${JSON.stringify({ controller: AppController.name })}`);

    // // @ts-ignore
    // this.logger.error('Calling getHello() debug', { controller: AppController.name });
    // @ts-ignore
    this.nestLogger.log(`info: ${JSON.stringify({ controller: AppController.name })}`)
    this.nestLogger.error('error information 1','')
    this.nestLogger.debug('debug information','')

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
