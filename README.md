# inventory-auto-count

A browser console script for automating inventory counting in Lightspeed Retail.

## What it does

- Reads the Expected quantity from each uncounted inventory row
- Selects the product
- Fills the Quantity field
- Clicks Count automatically
- Continues until all uncounted items are processed

## Usage

1. Open the Lightspeed inventory count page - Start counting.
2. **Scroll all the way to the bottom** first so that all inventory rows are fully loaded. 
3. Review the screen models **repaired this week** and physically check how many of each model are currently left in stock.
4. Review the screen models that **arrived this week** and physically check how many of each model are currently left in stock.
5. Check for any **negative stock quantities** and record how many items have a negative quantity.
6. These 2-4 steps above must be counted manually.
   Now we can use scripts to run automatically. 
   Switch to the **Uncounted** tab before starting.
7. Open Chrome DevTools and go to the Console. Paste the contents of `lightspeed-inventory-auto-count.js`.
8. Press Enter.

To stop the script:

```js
window.stopInventoryAuto = true;
```

# Mismatch Auto Count

This script is specifically designed to process inventory items marked as **mismatched**, the counted quantity does not match the expected quantity, which may have occurred after an unexpected issue while running the previous automatic inventory count script.

The mismatches may have resulted from timing, page state updates, or interrupted submissions during browser automation.

## Features

- Detects inventory rows marked with the mismatch icon
- Reads the expected quantity from the inventory table
- Opens the corresponding mismatched inventory item
- Automatically fills the expected quantity into the Quantity field
- Automatically clicks the Count button
- Continues until all mismatched items have been processed
- Includes basic validation and timeout protection to reduce duplicate submissions

## Usage

1. Stay on the count page in Lightspeed Retail.
2. Open Chrome DevTools.
3. Go to the **Console** tab.
4. Paste the script into the console.
5. Press Enter to start processing mismatched items.

To stop the script manually:

```js
window.stopMismatchAuto = true;
```
