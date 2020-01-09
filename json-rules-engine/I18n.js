'use strict';
const R = require('ramda');
const requireAll = require('require-all');
const path = require('path');
const i18next = require('i18next');

const i18nList = requireAll({
  dirname: path.join(__dirname, 'i18n'),
  filter: /.+\.json$/,
  recursive: true,
});

var resources = {};
R.mapObjIndexed((value, key) => {
   Object.assign(resources, value);
}, i18nList);

i18next.init({
  lng: 'zh-TW',
  debug: false,
  interpolation: {
      format: function(value, format, lng) {
          if (Array.isArray(value)) {
              var keys = format.split(",");
              var seperator = i18next.t(keys[1]);
              var arr = []
              R.mapObjIndexed((value, key) => {
                  arr = arr.concat(i18next.t(keys[0], value));
             }, value);
             return arr.join(seperator);
          }
          return value;
      }
  },
  resources: {
      'zh-TW': {
        translation: resources
      }
    }
  }, function(err, t) {
});

var assetKeys = ['assetCreated', 'assetUpdated', 'assetDeleted', 'assetRead'];
var errorKeys = ['errorRaised'];

// =================
exports.transform = function (msgCode, fact)
{
   for (var prop in fact) {
      if (assetKeys.includes(prop)) {
          /*
          fact.targetType = Object.keys(fact[prop])[0];
          fact.targetTypeName = i18next.t(fact.targetType);
          fact.assetId = fact[prop][fact.targetType][0].id;
          fact.assetName = "host-1234";
          fact.project = fact[prop][fact.targetType][0].project;
          */
          fact.targetType = fact[prop]['type'];
          fact.targetTypeName = i18next.t(fact.targetType);
          fact.elements = fact[prop]['elements'];
      }
   }
   fact.msgLocale = i18next.t(msgCode, fact);
   return fact;
}
