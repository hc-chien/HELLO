const opentracing = require('opentracing')
const jaeger = require('jaeger-client')
const http = require('http');
const https = require('https');
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');

var initTracer = require('jaeger-client').initTracer;
// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
var config = {
  serviceName: 'demo1: basic test',
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

const span = tracer.startSpan('HTTP GET');
var carrier = {};
tracer.inject(span.context(), FORMAT_HTTP_HEADERS, carrier)

// span.setBaggageItem("hello", "world");
// span.addTags({"error": true});
span.addTags({"userId": 12345});
span.log({"span.context": span.context()});

const opts = {
    host : 'webhook.site',
    method: 'GET',
    port : '443',
    path: '/47ed2e09-c9e4-4e1d-b017-dbaec1ad5c38',
    headers: carrier
};

span.logEvent('span.carrier', carrier);
span.setTag(opentracing.Tags.HTTP_URL, `https://${opts.host}${opts.path}`)
span.setTag(opentracing.Tags.HTTP_METHOD, opts.method)
span.logEvent('opts', opts);

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
        span.logEvent('data', chunk);
//       console.log('data');
    });
    res.on('end', () => {
        span.log({'event': 'request_end'});
        span.finish();
      console.log('bye');
    });
}).end();

// 結束太早的話, span.finish() 沒有執行將沒有資料
setTimeout(() => {
  tracer.close()
      console.log('byebye');
}, 1800)
