# localStorage 表單記憶設計

## 目標

讓借出表單的使用者欄位（公務機號碼、借出地點）保存在 localStorage，下次自動帶入，減少重複輸入。

## 儲存機制

- **儲存時機**：借出表單提交成功後
- **儲存內容**：
  - `dm_phoneNumber` — 公務機號碼（4 位數字）
  - `dm_location` — 借出地點（下拉選單的值）
- **讀取時機**：頁面載入時，自動帶入已儲存的值

## 影響範圍

兩個頁面都要處理：

1. **scan-form.html** — 欄位 `phoneNumber`、`location`（只在借出時出現）
2. **index.html** — 欄位 `borrowPhoneNumber`、`borrowLocation`（借出 Modal）

## 行為

- 頁面載入後，從 localStorage 讀取值並填入對應欄位
- 使用者可以自由修改帶入的值
- 提交成功後，用最新的值覆蓋 localStorage
- 歸還操作不受影響（歸還不需要這些欄位）

## 不做的事

- 不加清除按鈕
- 不加多人切換
- 不記住歸還相關欄位（歸還地點是系統自動決定的）

## 方案選擇

選擇了「簡單 localStorage 自動帶入」方案（方案 A），因為使用情境通常是每個人自己的手機掃 QR Code，一台裝置基本上就是一個人在用。
