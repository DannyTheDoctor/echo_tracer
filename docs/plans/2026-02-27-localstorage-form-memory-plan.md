# localStorage 表單記憶 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 讓借出表單的公務機號碼和借出地點自動從 localStorage 帶入，減少使用者重複輸入。

**Architecture:** 在借出成功後將 phoneNumber 和 location 存入 localStorage（key: `dm_phoneNumber`, `dm_location`）。頁面載入或表單渲染時，從 localStorage 讀取並填入對應欄位。兩個頁面（scan-form.html、index.html）共用相同的 localStorage key。

**Tech Stack:** 純 JavaScript、localStorage API

---

### Task 1: scan-form.html — 借出成功後儲存到 localStorage

**Files:**
- Modify: `scan-form.html:619-629`（handleSubmit 函數的成功區塊）

**Step 1: 在借出成功後加入 localStorage 儲存邏輯**

在 `handleSubmit` 函數中，`if (actionType === '借出')` 成功區塊內，於顯示成功訊息之後、重設表單之前，加入：

```javascript
// 儲存到 localStorage
localStorage.setItem('dm_phoneNumber', phoneNumber);
localStorage.setItem('dm_location', location);
```

具體位置：在 `scan-form.html` 第 624 行（`messageDiv.className = 'message success';`）之後，第 627 行（`document.getElementById('deviceForm').reset();`）之前插入。

**Step 2: 驗證修改正確**

用瀏覽器開啟 `scan-form.html?device_id=CVC%20echo&type=借出`，填入號碼和地點後送出，打開 DevTools > Application > localStorage 確認 `dm_phoneNumber` 和 `dm_location` 已儲存。

**Step 3: Commit**

```bash
git add scan-form.html
git commit -m "feat(scan-form): 借出成功後儲存 phoneNumber 和 location 到 localStorage"
```

---

### Task 2: scan-form.html — 頁面載入時自動帶入 localStorage 的值

**Files:**
- Modify: `scan-form.html:521-528`（showBorrowForm 函數末尾）

**Step 1: 在 showBorrowForm 函數中，綁定表單事件之後，加入自動帶入邏輯**

在 `showBorrowForm()` 函數末尾（第 522 行 `addEventListener` 之後、第 528 行函數結束 `}` 之前）加入：

```javascript
// 從 localStorage 帶入上次的值
const savedPhone = localStorage.getItem('dm_phoneNumber');
const savedLocation = localStorage.getItem('dm_location');
if (savedPhone) {
    document.getElementById('phoneNumber').value = savedPhone;
}
if (savedLocation) {
    document.getElementById('location').value = savedLocation;
}
```

**Step 2: 驗證修改正確**

先手動在 DevTools 中設定 `localStorage.setItem('dm_phoneNumber', '1234')`，重新載入頁面，確認欄位自動帶入。

**Step 3: Commit**

```bash
git add scan-form.html
git commit -m "feat(scan-form): 頁面載入時從 localStorage 自動帶入借用者欄位"
```

---

### Task 3: index.html — 借出成功後儲存到 localStorage

**Files:**
- Modify: `index.html:1125-1130`（borrowForm submit handler 成功區塊）

**Step 1: 在借出成功後加入 localStorage 儲存邏輯**

在 `borrowForm` 的 submit handler 中，`await fetch(...)` 成功之後（第 1125 行之後），`closeModal('borrowModal')` 之前，加入：

```javascript
// 儲存到 localStorage
localStorage.setItem('dm_phoneNumber', phoneNumber);
localStorage.setItem('dm_location', location);
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat(index): 借出成功後儲存 phoneNumber 和 location 到 localStorage"
```

---

### Task 4: index.html — 打開借出 Modal 時自動帶入 localStorage 的值

**Files:**
- Modify: `index.html:1068-1074`（openBorrowModal 函數）

**Step 1: 修改 openBorrowModal 函數，從 localStorage 帶入預設值**

將目前的清空邏輯改為從 localStorage 讀取：

```javascript
function openBorrowModal(deviceId) {
    document.getElementById('borrowDeviceId').value = deviceId;
    document.getElementById('borrowModalTitle').textContent = `借出設備 - ${deviceId}`;
    document.getElementById('borrowPhoneNumber').value = localStorage.getItem('dm_phoneNumber') || '';
    document.getElementById('borrowLocation').value = localStorage.getItem('dm_location') || '';
    document.getElementById('borrowModal').classList.add('active');
}
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat(index): 打開借出 Modal 時從 localStorage 自動帶入借用者欄位"
```

---

### Task 5: 最終驗證

**Step 1: 在 scan-form.html 完整測試**

1. 開啟 `scan-form.html?device_id=CVC%20echo&type=借出`
2. 填入公務機號碼 `1234` 和地點 `8東`，送出
3. 重新載入頁面，確認欄位自動帶入 `1234` 和 `8東`
4. 修改為 `5678` 和 `6西`，送出
5. 重新載入，確認更新為 `5678` 和 `6西`

**Step 2: 在 index.html 完整測試**

1. 開啟 `index.html`
2. 點選任一設備的「借出」按鈕，確認 Modal 中自動帶入上次的值
3. 修改值後送出，再次開啟 Modal，確認更新

**Step 3: 跨頁面測試**

1. 在 scan-form.html 借出成功
2. 開啟 index.html，打開借出 Modal，確認帶入 scan-form 存的值（反之亦然）

**Step 4: 歸還不受影響測試**

1. 開啟 `scan-form.html?device_id=CVC%20echo&type=歸還`
2. 確認歸還表單正常運作，不會出現額外欄位或錯誤
