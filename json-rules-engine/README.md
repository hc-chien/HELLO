# json rules (/rules)
- 定義需要匹配的產品日誌
- 每則 rule 需要一個對應的 msgCode

# message 與 i18n (/i18n)
- msgCode 與 message template 的 mapping table

# level 轉換
例如原始 log 的 level 是 "debug", 要改成 "info", 可在 rules 的 params 加入 "level"
```
      "event": {
        "type": "tagging",
        "params": {
          "msgCode": "assetCreated",
          "level": "info"
        }
```

# transform
- assetId 轉 assetName
- targetType
- targetTypeName
- project

# 測試
```node main.js messages1```
