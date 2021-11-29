import { ConsoleLogger, Injectable } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
const Transport = require('winston-transport');

@Injectable()
export class WinstonLoggerInjector implements Injector {
    public inject() {
        Transport.prototype.info = this.wrapPrototype(
            Transport.prototype.info,
        );
        Transport.prototype.debug = this.wrapPrototype(
            Transport.prototype.debug,
        );
        Transport.prototype.error = this.wrapPrototype(
            Transport.prototype.error,
        );
        Transport.prototype.verbose = this.wrapPrototype(
            Transport.prototype.verbose,
        );
        Transport.prototype.warn = this.wrapPrototype(
            Transport.prototype.warn,
        );
    }

    private wrapPrototype(prototype) {
        return {
            [prototype.name]: function (...args: any[]) {
                args[0] = WinstonLoggerInjector.getMessage(args[0]);
                prototype.apply(this, args);
            },
        }[prototype.name];
    }

    private static getMessage(message: string) {
        const currentSpan = trace.getSpan(context.active());
        if (!currentSpan) return message;

        const spanContext = trace.getSpan(context.active()).spanContext();
        currentSpan.addEvent(message);

        return `[${spanContext.traceId}] ${message}`;
    }
}

export interface Injector {
    inject();
}