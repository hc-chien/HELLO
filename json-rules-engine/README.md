# Dictionary for mapping rules
## 目錄

### json rules (/rules)
- 產品日誌的匹配規則，以檔名分類
- 比對順序依照 priority 大小設定

### message 與 i18n (/i18n)
- msgTemplateId 與 message template 的 mapping table

## json rules 參數說明
### level
如果要修改 prod log 的 level，在 event params 增加 level 欄位，範例如下:
```
      "event": {
        "type": "tagging",
        "params": {
          "msgTemplateId": "assetCreated",
          "level": "info"
        }
      }
```

### realtime 
預設不是 realtime message，如果要設成 realtime message，則設定 realtime = "true"
```
      "event": {
        "type": "tagging",
        "params": {
          "msgTemplateId": "assetCreated",
          "realtime": "true"
        }
      }
```

### prod
預設輸出是 product log，如果要設成非 product log，則設定 prod = "false"
```
      "event": {
        "type": "tagging",
        "params": {
          "msgTemplateId": "assetCreated",
          "prod": "false"
        }
      }
```

### msgTemplateId
以 msgTemplateId 對應到 i18n 的 message template

### priority
多筆 rules 匹配時，會依照 priority 比對，只要有一筆比對成功，後面就不會再比對。
```
      "event": {
        "type": "tagging",
        "params": {
          "msgTemplateId": "assetCreated",
        }
      },
      "priority": 2
```

## transform
transformer 會新增以下欄位
- assetId
- assetName
- targetType
- targetTypeName
- project

## 測試
`node main.js messages1`

```json
{
  "taskId": "WF-1570504132-zdpyYr",
  "dateTime": "2019-10-08T05:32:34.231Z",
  "level": "info",
  "podId": "corezilla:commandusers-c775854d4-49cb9",
  "component": "Hosts",
  "function": "save",
  "caller": {
    "userId": "U-dk0p08kqc",
    "name": "green",
    "account": "green",
    "callerType": "user",
    "iat": 1234567890,
    "ip": "1.1.1.1",
    "xForwardFor": "1.2.3.4"
  },
  "message": "assetCreated: host",
  "assetCreated": {
    "host": [
      {
        "id": "S-dk0p08kqc",
        "project": [
          "PJ-dk1ha57i4",
          "PJ-dk1ha57i4"
        ]
      }
    ]
  },
  "targetType": "host",
  "targetTypeName": "服務器",
  "assetId": "S-dk0p08kqc",
  "assetName": "host-1234",
  "project": [
    "PJ-dk1ha57i4",
    "PJ-dk1ha57i4"
  ],
  "tmsg": "添加服務器:host-1234 (S-dk0p08kqc) 成功"
}
```
