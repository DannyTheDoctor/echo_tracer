# 故障排除指南

## CVC echo 一直顯示「載入中」或「載入失敗」

### 問題原因

這個問題通常是因為 Google Sheet 中的設備名稱與前端程式碼不完全匹配造成的。

### 檢查步驟

1. **打開瀏覽器開發者工具**
   - 按 F12 或右鍵點擊「檢查」
   - 切換到「Console」標籤

2. **查看 Console 日誌**
   - 點擊「重新整理」按鈕
   - 查看日誌中是否有以下訊息：
     ```
     Loading device status for: CVC echo
     Response data for CVC echo : {...}
     ```

3. **檢查 Google Sheet**
   - 打開您的 Google Sheet
   - 確認「設備ID」欄位中的設備名稱
   - 確保名稱**完全一致**，包括：
     - 空格位置和數量
     - 大小寫
     - 沒有前後多餘空格

### 常見問題

#### 問題 1：設備名稱不一致
**症狀**：Console 顯示 `No data found for CVC echo`

**解決方法**：
- 檢查 Google Sheet 中是否有 "CVC echo" 的記錄
- 可能的變異：
  - `CVC  echo`（兩個空格）
  - `CVC Echo`（大寫 E）
  - `cvc echo`（小寫）
  - ` CVC echo`（前面有空格）
  - `CVC echo `（後面有空格）

**修正方式**：
1. 統一 Google Sheet 中所有記錄的設備名稱為 `CVC echo`
2. 或者修改前端程式碼中的設備名稱以匹配 Sheet

#### 問題 2：Google Apps Script 未正確部署
**症狀**：Console 顯示網路錯誤或 CORS 錯誤

**解決方法**：
1. 重新部署 Google Apps Script
2. 確認部署設定：
   - 執行身分：我
   - 存取權：所有人
3. 複製新的 URL 並更新 `index.html` 中的 `SCRIPT_URL`

#### 問題 3：Google Sheet 沒有任何記錄
**症狀**：Console 顯示 `No data found for CVC echo`

**解決方法**：
- 確認 Google Sheet 中至少有一筆該設備的記錄
- 可以手動新增一筆測試記錄

### 測試建議

1. **新增測試記錄**
   - 使用「借出」功能新增一筆 CVC echo 的記錄
   - 確認記錄是否成功寫入 Google Sheet
   - 重新整理頁面，查看是否能正確顯示

2. **比較其他設備**
   - 如果「新三頭超音波」或「舊二頭超音波」能正常顯示
   - 比較 Google Sheet 中這些設備的名稱格式
   - 確保 CVC echo 的格式與它們一致

### 需要協助？

如果以上方法都無法解決問題，請提供以下資訊：
1. Console 中的完整錯誤訊息
2. Google Sheet 中的設備名稱截圖
3. 前端程式碼中的 DEVICES 配置
