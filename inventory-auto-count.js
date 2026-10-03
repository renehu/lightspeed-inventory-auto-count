(async () => {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  window.stopInventoryAuto = false;

  function getFirstRow() {
    return document.querySelector(
      'table[data-testid="table"] tbody tr[data-testid="table-row"]'
    );
  }

  function getRowInfo(row) {
    const cells = row.querySelectorAll('td');

    const product =
      row.querySelector('[data-testid="badgeHeader"]')
        ?.innerText.trim() || 'Unknown product';

    const expected =
      cells[cells.length - 2]
        ?.innerText.trim();

    return { product, expected };
  }

  function setQuantity(value) {
    const input = document.querySelector(
      'input[name="quantity"]'
    );

    if (!input) {
      throw new Error('Quantity input not found');
    }

    const setter =
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      ).set;

    setter.call(input, String(value));

    input.dispatchEvent(
      new Event('input', { bubbles: true })
    );

    input.dispatchEvent(
      new Event('change', { bubbles: true })
    );

    return input;
  }

  let processed = 0;

  console.log('Automatic inventory count started.');
  console.log(
    'To stop, run: window.stopInventoryAuto = true'
  );

  while (true) {

    if (window.stopInventoryAuto) {
      console.log('Process stopped.');
      break;
    }

    const row = getFirstRow();

    if (!row) {
      console.log('No uncounted items remaining.');
      break;
    }

    const { product, expected } = getRowInfo(row);

    if (
      expected === undefined ||
      expected === '' ||
      !/^-?\d+(\.\d+)?$/.test(expected)
    ) {
      console.error(
        `Invalid expected quantity: ${product} | Expected = ${expected}`
      );
      break;
    }

    console.log(
      `${processed + 1}. ${product} | Expected = ${expected}`
    );

    const previousProduct = product;

    row.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    row.click();

    await sleep(400);

    const input = setQuantity(expected);

    await sleep(300);

    if (input.value !== String(expected)) {
      console.error(
        `Failed to set quantity: ${product} | Expected = ${expected} | Actual = ${input.value}`
      );
      break;
    }

    const countButton = document.querySelector(
      'button[data-testid="submit-count"]'
    );

    if (!countButton) {
      console.error('Count button not found.');
      break;
    }

    countButton.click();

    let updated = false;

    for (let i = 0; i < 40; i++) {
      await sleep(250);

      if (window.stopInventoryAuto) {
        break;
      }

      const currentRow = getFirstRow();

      if (!currentRow) {
        updated = true;
        break;
      }

      const currentProduct =
        currentRow
          .querySelector('[data-testid="badgeHeader"]')
          ?.innerText.trim();

      if (currentProduct !== previousProduct) {
        updated = true;
        break;
      }
    }

    if (window.stopInventoryAuto) {
      console.log('Process stopped.');
      break;
    }

    if (!updated) {
      console.error(
        `No page update detected within 10 seconds. Process stopped to prevent duplicate submission: ${product}`
      );
      break;
    }

    processed++;

    await sleep(500);
  }

  console.log(
    `Automatic inventory count finished. Total completed: ${processed}`
  );
})();