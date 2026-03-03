function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('CDO Barangay Collector')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fetches grouped data (Unique names + consolidated status)
function getBarangayData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("misamis_cdo");
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; 
  
  const values = sheet.getRange("A2:C" + lastRow).getValues();
  const groups = {};

  values.forEach(row => {
    const name = row[0].toString().trim();
    const status = parseInt(row[2]) || 0;
    if (name) {
      if (!groups[name]) groups[name] = { name: name, status: 1 };
      if (status === 0) groups[name].status = 0;
    }
  });
  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
}

// BATCH UPDATE: Set Column C to 1
function updateStatusToCollected(barangayName) {
  return changeStatus(barangayName, 1);
}

// NEW: Reset Column C to 0
function resetStatusToZero(barangayName) {
  return changeStatus(barangayName, 0);
}

// Helper function to handle the value change
function changeStatus(barangayName, newValue) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("misamis_cdo");
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange("A2:C" + lastRow);
  const values = range.getValues();
  let updatedCount = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i][0].toString().trim() === barangayName) {
      sheet.getRange(i + 2, 3).setValue(newValue);
      updatedCount++;
    }
  }
  return "Updated " + updatedCount + " record(s) for " + barangayName + " to " + newValue;
}