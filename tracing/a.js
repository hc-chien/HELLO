const opentracing = require('opentracing')
const jaeger = require('jaeger-client')
// const http = require('http');

// NOTE: the default OpenTracing tracer does not record any tracing information.
// Replace this line with the tracer implementation of your choice.
// const tracer = new opentracing.Tracer();

var initTracer = require('jaeger-client').initTracer;
// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
var config = {
  serviceName: 'gg-service',
/*
  reporter: {
    // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
    // spans over HTTP
    collectorEndpoint: 'http://g1:14268/api/traces',
    // Provide username and password if authentication is enabled in the Collector
    // username: '',
    // password: '',
  },
*/
  sampler: {
    type: 'const',
    param: 1,
//    host: 'localhost',
//    port: '16686',
    refreshIntervalMs: 500
  }
};
var options = {
  tags: {
    'my-awesome-service.version': '1.1.2',
  },
  metrics: null,
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

console.log('aaa');

/*
const span = tracer.startSpan('debug');
 span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1);
 span.setTag(opentracing.Tags.ERROR, true);
 span.log({'event': 'error'});
 span.finish();
 tracer.close()

console.log('aaa');
*/

const parentSpan = tracer.startSpan('test')
parentSpan.addTags({ level: 0 })

const child = tracer.startSpan('child_span', { childOf: parentSpan })
child.setTag('alpha', '200')
child.setTag('beta', '50')
child.log({state: 'waiting'})

setTimeout(() => {
  child.log({state: 'done'})
  child.finish()
  parentSpan.finish()
  tracer.close()
}, 500)
