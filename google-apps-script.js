/**
 * Google Apps Script - 設備借用表單後端
 *
 * 使用說明：
 * 1. 開啟您的 Google Sheet
 * 2. 點選「擴充功能」>「Apps Script」
 * 3. 將此檔案的內容貼到編輯器中
 * 4. 儲存專案（Ctrl+S）
 * 5. 點選「部署」>「新增部署作業」
 * 6. 選擇類型為「網頁應用程式」
 * 7. 設定：
 *    - 執行身分：我
 *    - 存取權：所有人
 * 8. 點選「部署」並複製產生的 URL
 * 9. 將 URL 貼到 index.html 中的 SCRIPT_URL 變數
 */

// 處理 POST 請求
function doPost(e) {
  try {
    // 解析 JSON 資料
    const data = JSON.parse(e.postData.contents);

    // 取得目前的 Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 產生時間戳記
    const timestamp = new Date();
    const formattedTime = Utilities.formatDate(timestamp, 'Asia/Taipei', 'yyyy/MM/dd HH:mm:ss');

    // 寫入資料（依照欄位順序：時間戳記、username、location、設備ID、借還）
    sheet.appendRow([
      formattedTime,
      data.username,
      data.location,
      data.deviceId,
      data.borrowStatus
    ]);

    // 回傳成功訊息
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: '資料已成功寫入' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 回傳錯誤訊息
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 處理 GET 請求
function doGet(e) {
  try {
    const action = e.parameter.action;

    // 查詢特定設備的最新記錄
    if (action === 'getLatest') {
      const deviceId = e.parameter.deviceId;
      const latestRecord = getLatestDeviceRecord(deviceId);

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          data: latestRecord
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 查詢所有設備的最新記錄
    if (action === 'getAllLatest') {
      const devices = ['device_a', 'device_b', 'device_c'];
      const results = {};

      devices.forEach(deviceId => {
        results[deviceId] = getLatestDeviceRecord(deviceId);
      });

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          data: results
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 預設回應
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: '設備借用 API 運作中' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 取得特定設備的最新記錄
function getLatestDeviceRecord(deviceId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // 欄位順序：時間戳記(0)、username(1)、location(2)、設備ID(3)、借還(4)
  let latestRecord = null;

  // 從最後一筆往前找（跳過標題列）
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][3] === deviceId) {
      latestRecord = {
        timestamp: data[i][0],
        username: data[i][1],
        location: data[i][2],
        deviceId: data[i][3],
        borrowStatus: data[i][4]
      };
      break;
    }
  }

  return latestRecord;
}
