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
          fact.assetType = Object.keys(fact[prop])[0];
          fact.assetTypeName = i18next.t(fact.assetType);
          fact.assetId = fact[prop][fact.assetType][0].id;
          fact.assetName = "host-1234";
          fact.project = fact[prop][fact.assetType][0].project;
      }
   }
   fact.msgLocale = i18next.t(msgCode, fact);
   return fact;
}
