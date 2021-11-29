import {context, trace} from "@opentelemetry/api";

const { format } = require('winston');

export default format((info, opts) => {
    if (opts.yell) {
        info.message = info.message.toUpperCase();
    } else if (opts.whisper) {
        info.message = info.message.toLowerCase();
    }
    const currentSpan = trace.getSpan(context.active());
    if (!currentSpan) return info;

    const spanContext = trace.getSpan(context.active()).spanContext();
    console.log(info.message)
    currentSpan.addEvent(info.message);

    info.message = `[${spanContext.traceId}] ${info.message}`
    return info;
});
//
// // `volume` is now a function that returns instances of the format.
// const scream = volume({ yell: true });
// console.dir(scream.transform({
//     level: 'info',
//     message: `sorry for making you YELL in your head!`
// }, scream.options));
// // {
// //   level: 'info'
// //   message: 'SORRY FOR MAKING YOU YELL IN YOUR HEAD!'
// // }
//
// // `volume` can be used multiple times to create different formats.
// const whisper = volume({ whisper: true });
// console.dir(whisper.transform({
//     level: 'info',
//     message: `WHY ARE THEY MAKING US YELL SO MUCH!`
// }, whisper.options));
// // {
// //   level: 'info'
// //   message: 'why are they making us yell so much!'
// // }