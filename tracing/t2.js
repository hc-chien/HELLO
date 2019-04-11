const opentracing = require('opentracing')
const jaeger = require('jaeger-client')
const http = require('http');
const https = require('https');

// NOTE: the default OpenTracing tracer does not record any tracing information.
// Replace this line with the tracer implementation of your choice.
// const tracer = new opentracing.Tracer();

var initTracer = require('jaeger-client').initTracer;
// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
var config = {
  serviceName: 'kkkk',
  sampler: {
    type: 'const',
    param: 1,
    refreshIntervalMs: 500
  }
};
var options = {
  tags: {
    'kkkk.version': '1.1.2',
  },
  logger: {
    info(msg) {
      console.log('INFO', msg)
    },
    error(msg) {
      console.error('ERROR', msg)
    }
  }
};
var tracer = initTracer(config, options);


const span = tracer.startSpan('https_request');
span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1);
const opts = {
    host : 'webhook.site',
    method: 'GET',
    port : '443',
    path: '/47ed2e09-c9e4-4e1d-b017-dbaec1ad5c38',
};
span.setOperationName('
https.request(opts, res => {
    res.setEncoding('utf8');
    res.on('error', err => {
        // assuming no retries, mark the span as failed
        span.setTag(opentracing.Tags.ERROR, true);
        span.log({'event': 'error', 'error.object': err, 'message': err.message, 'stack': err.stack});
        span.finish();
    });
    res.on('data', chunk => {
        span.log({'event': 'data_received', 'chunk_length': chunk.length});
    });
    res.on('end', () => {
        span.log({'event': 'request_end'});
        span.finish();
    });
}).end();

setTimeout(() => {
  tracer.close()
}, 500)
