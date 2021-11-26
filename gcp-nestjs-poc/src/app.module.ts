import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {makeHistogramProvider, PrometheusModule} from "@willsoto/nestjs-prometheus";
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import {
  OpenTelemetryModule,
  ControllerInjector,
  EventEmitterInjector,
  GuardInjector,
  LoggerInjector,
  PipeInjector,
  ScheduleInjector,
} from '@metinseylan/nestjs-opentelemetry';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

@Module({
  imports: [PrometheusModule.register(), OpenTelemetryModule.forRoot({
    traceAutoInjectors: [
      ControllerInjector,
      GuardInjector,
      EventEmitterInjector,
      ScheduleInjector,
      PipeInjector,
      LoggerInjector,
    ],
    spanProcessor: new SimpleSpanProcessor(
        new ZipkinExporter({
          serviceName:'example-nestjs',
        })
    ),
  })],
  controllers: [AppController],
  providers: [AppService, makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in microseconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
  })],
})
export class AppModule {}
