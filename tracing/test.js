const opentracing = require('opentracing')
const jaeger = require('jaeger-client')
const http = require('http');
const https = require('https');
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');

// NOTE: the default OpenTracing tracer does not record any tracing information.
// Replace this line with the tracer implementation of your choice.
// const tracer = new opentracing.Tracer();

var initTracer = require('jaeger-client').initTracer;
// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
var config = {
  serviceName: 'kkkk',
//  reporter: {
    // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
    // spans over HTTP
    collectorEndpoint: 'http://g1:16686/api/traces',
    // Provide username and password if authentication is enabled in the Collector
    // username: '',
    // password: '',
//    logSpan: true
//  },
  sampler: {
    type: 'const',
    param: 1,
//    host: 'localhost',
//    port: '16686',
    refreshIntervalMs: 500
  }
};

/*
  sampling 可根據 service + operation 調整
  https://www.jaegertracing.io/docs/1.10/sampling/
*/

var options = {
  tags: {
    'version': '1.1.2',
  },
  // metrics: metrics,
  // logger: logger,
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

const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, {});
// console.log(parentSpanContext);

const span = tracer.startSpan('https_request', {childOf: parentSpanContext});

// 有什麼行李想往下一個 node 傳達的，就放在 BaggageItem 裡面
// 例如傳遞: workflow-id, debug code?
span.setBaggageItem("hello", "world");
console.log(span.context().toString());
console.log(span.context());

var carrier = {};
tracer.inject(span.context(), FORMAT_HTTP_HEADERS, carrier)
console.log(carrier);

// 解 header....
wireCtx = tracer.extract(FORMAT_HTTP_HEADERS, carrier);
console.log(wireCtx);

// { 'uber-trace-id': 'af144c2896253e30:af144c2896253e30:0:1',
//   'uberctx-hello': 'world' }

// span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1);
const opts = {
    host : 'webhook.site',
    method: 'GET',
    port : '443',
    path: '/47ed2e09-c9e4-4e1d-b017-dbaec1ad5c38',
    headers: carrier
// headers: { 'trace-span-context': span.context().toString() }
};
// span.addTags(opts);

span.setTag(opentracing.Tags.HTTP_URL, `https://${opts.host}${opts.pathl}`)
span.setTag(opentracing.Tags.HTTP_METHOD, opts.method)
// span.setOperationName(opts.method)
// span.setOperationName(opts.method)
// span.setTag('request_path', req.route.path)
// span.setTag('request_id', req.headers['x-request-id'])
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
      console.log('data');
    });
    res.on('end', () => {
        span.log({'event': 'request_end'});
        span.finish();
      console.log('bye');
    });
}).end();

/*
var config2 = {
  serviceName: 'gggg'
};
*/

// 重複呼叫 initTracer 會出錯
// var tracer2 = initTracer(config2, options);
const span2 = tracer.startSpan('QQ_request', {childOf: span});
span2.log({'hello': 'QQ'});
span2.setBaggageItem("gg", "123");
// span2.setOperationName('this is a book')
console.log(span2.context().toString());
console.log(span2.context());
span2.finish();

// 結束太早的話, span.finish() 沒有執行將沒有資料
setTimeout(() => {
  tracer.close()
      console.log('byebye');
}, 1800)
