# Dictionary for mapping rules
## 作法

### json rules (/rules)
- 定義需要匹配的產品日誌
- 每則 rule 需要一個對應的 msgCode
- 可以多則 rules 對應同一個 msgCode

### message 與 i18n (/i18n)
- msgCode 與 message template 的 mapping table

### 替換 level
預設為 raw log 的 level， 如果要改，則在 event params 增加 level 欄位，範例如下
```
      "event": {
        "type": "tagging",
        "params": {
          "msgCode": "assetCreated",
          "level": "info"
        }
      }
```

### 設定 realtime message
預設不是 realtime message，如果要設成 realtime message，則設定 realtime = "true"
```
      "event": {
        "type": "tagging",
        "params": {
          "msgCode": "assetCreated",
          "realtime": "true"
        }
      }
```

### 設定 prod log
預設是 prod log，如果要設成非 prod log，則設定 prod = "false"
```
      "event": {
        "type": "tagging",
        "params": {
          "msgCode": "assetCreated",
          "prod": "false"
        }
      }
```

### 多條 rules 的匹配順序
多筆 rules 匹配時，會依照 priority 比對，只要有一筆比對成功，後面就不會再比對。
```
      "event": {
        "type": "tagging",
        "params": {
          "msgCode": "assetCreated",
        }
      },
      "priority": 2
```

## transform
- assetId 轉 assetName
- targetType
- targetTypeName
- project

## 測試
```node main.js messages1```

