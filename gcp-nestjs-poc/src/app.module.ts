import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {makeHistogramProvider, PrometheusModule} from "@willsoto/nestjs-prometheus";
import {
  OpenTelemetryModule,
  ControllerInjector,
  EventEmitterInjector,
  GuardInjector,
  LoggerInjector,
  PipeInjector,
  ScheduleInjector,
} from '@metinseylan/nestjs-opentelemetry';
// import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import {LoggingWinston} from "@google-cloud/logging-winston";
import {context, trace} from "@opentelemetry/api";
import {ClientsModule, Transport} from "@nestjs/microservices";

// private static getMessage(message: string) {
//   const currentSpan = trace.getSpan(context.active());
//   if (!currentSpan) return message;
//
//   const spanContext = trace.getSpan(context.active()).spanContext();
//   currentSpan.addEvent(message);
//
//   return `[${spanContext.traceId}] ${message}`;
// }

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'some-redis',
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
        }
      },
    ]),
      PrometheusModule.register(),
    OpenTelemetryModule.forRoot({
      traceAutoInjectors: [
        ControllerInjector,
        GuardInjector,
        EventEmitterInjector,
        ScheduleInjector,
        PipeInjector,
        LoggerInjector,
      ],
      spanProcessor: new SimpleSpanProcessor(
          new TraceExporter({
            // If you are not in a GCP environment, you will need to provide your
            // service account key here. See the Authentication section below.
            keyFile: './local-development.json',
            keyFileName: './local-development.json',
          })
      ),
    }),
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.Console({
    //       format: winston.format.combine(
    //           winston.format.timestamp(),
    //           winston.format.ms(),
    //           nestWinstonModuleUtilities.format.nestLike('Thin', { prettyPrint: true }),
    //       ),
    //     }),
    //     new LoggingWinston({
    //       projectId: 'winter-legend-331606',
    //       logName: 'winston-log'
    //     })
    //   ],
    // })
  ],
  controllers: [AppController],
  providers: [AppService, makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in microseconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
  })],
})
export class AppModule {}
