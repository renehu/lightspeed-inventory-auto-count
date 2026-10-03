# inventory-auto-count

A browser console script for automating inventory counting in Lightspeed Retail.

## What it does

- Reads the Expected quantity from each uncounted inventory row
- Selects the product
- Fills the Quantity field
- Clicks Count automatically
- Continues until all uncounted items are processed

## Usage

1. Open the Lightspeed inventory count page.
2. Open Chrome DevTools.
3. Go to Console.
4. Paste the contents of `lightspeed-inventory-auto-count.js`.
5. Press Enter.

To stop the script:

```js
window.stopInventoryAuto = true;
```

# Mismatch Auto Count

This script is specifically designed to process inventory items marked as **mismatched**, where the counted quantity does not match the expected quantity.

## Features

- Detects inventory rows marked with the mismatch icon
- Reads the expected quantity from the inventory table
- Opens the corresponding mismatched inventory item
- Automatically fills the expected quantity into the Quantity field
- Automatically clicks the Count button
- Continues until all mismatched items have been processed
- Includes basic validation and timeout protection to reduce duplicate submissions

## Usage

1. Open the relevant inventory count page in Lightspeed Retail.
2. Open Chrome DevTools.
3. Go to the **Console** tab.
4. Paste the script into the console.
5. Press Enter to start processing mismatched items.

To stop the script manually:

```js
window.stopMismatchAuto = true;
```
