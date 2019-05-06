const opentracing = require('opentracing')
const jaeger = require('jaeger-client')
const http = require('http');
const https = require('https');
const { Tags, FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP, followsFrom, childOf } = require('opentracing');

var initTracer = require('jaeger-client').initTracer;
// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
var config = {
  serviceName: 'followsFrom',
  reporter: {
    collectorEndpoint: 'http://192.168.89.125:14268/api/traces',
  },
  sampler: {
    type: 'const',
    param: 1,
    refreshIntervalMs: 500
  }
};

var options = {};
var tracer = initTracer(config, options);

const span = tracer.startSpan('JOB 0');
var carrier = {};
tracer.inject(span.context(), FORMAT_HTTP_HEADERS, carrier)

span.log({"span.context": span.context()});

setTimeout(() => {
  job1(span.context());
  span.finish();
  console.log('bye0');
}, 500)

function job1(ctx) {
  var span = tracer.startSpan('JOB 1',
    {
        references: [
            followsFrom(ctx)
        ],
    }
  );

  span.log({"span.context": span.context()});
  setTimeout(() => {
    job2(span.context());
    span.finish();
    console.log('bye1');
  }, 500)
}

function job2(ctx) {
  var span = tracer.startSpan('JOB 2',
    {
        references: [
            followsFrom(ctx)
        ],
    }
  );

  span.log({"span.context": span.context()});
  setTimeout(() => {
    span.finish();
    console.log('bye2');
  }, 500)
}

setTimeout(() => {
  tracer.close()
  console.log('byebye');
}, 1800)
