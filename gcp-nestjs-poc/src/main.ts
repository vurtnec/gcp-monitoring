import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {WINSTON_MODULE_NEST_PROVIDER, WinstonModule} from 'nest-winston';
import * as winston from "winston";
import {utilities as nestWinstonModuleUtilities} from "nest-winston/dist/winston.utilities";
import {LoggingWinston} from "@google-cloud/logging-winston";
import val from './format'


async function bootstrap() {
  const app = await NestFactory.create(AppModule,
      {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              val(),
              nestWinstonModuleUtilities.format.nestLike('Thin', { prettyPrint: true }),
          ),
        }),
        new LoggingWinston({
          projectId: 'winter-legend-331606',
          logName: 'winston-log'
        })
      ],
    })
  }
  );
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(3000);
}
bootstrap();

