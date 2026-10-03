(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  window.stopMismatchAuto = false;

  function getAllRows() {
    return [
      ...document.querySelectorAll(
        'table[data-testid="table"] tbody tr[data-testid="table-row"]',
      ),
    ];
  }

  function getMismatchRow() {
    return getAllRows().find((row) => row.querySelector("i.fa-dot-circle-o"));
  }

  function getRowInfo(row) {
    const cells = row.querySelectorAll("td");

    const product =
      row.querySelector('[data-testid="badgeHeader"]')?.innerText.trim() ||
      "Unknown product";

    const expected = cells[cells.length - 2]?.innerText.trim();

    const counted = cells[cells.length - 1]?.innerText.trim();

    return { product, expected, counted };
  }

  function setQuantity(value) {
    const input = document.querySelector('input[name="quantity"]');

    if (!input) {
      throw new Error("Quantity input not found");
    }

    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set;

    setter.call(input, String(value));

    input.dispatchEvent(new Event("input", { bubbles: true }));

    input.dispatchEvent(new Event("change", { bubbles: true }));

    return input;
  }

  let processed = 0;

  console.log("Mismatch auto-count started.");
  console.log(
    `Mismatch icons found: ${document.querySelectorAll("i.fa-dot-circle-o").length}`,
  );
  console.log("To stop, run: window.stopMismatchAuto = true");

  while (true) {
    if (window.stopMismatchAuto) {
      console.log("Process stopped.");
      break;
    }

    const row = getMismatchRow();

    if (!row) {
      console.log("No mismatched items remaining.");
      break;
    }

    const { product, expected, counted } = getRowInfo(row);

    if (
      expected === undefined ||
      expected === "" ||
      !/^-?\d+(\.\d+)?$/.test(expected)
    ) {
      console.error(
        `Invalid expected quantity: ${product} | Expected = ${expected}`,
      );
      break;
    }

    console.log(
      `${processed + 1}. ${product} | Expected = ${expected} | Counted = ${counted}`,
    );

    row.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    row.click();

    await sleep(500);

    const input = setQuantity(expected);

    await sleep(300);

    if (input.value !== String(expected)) {
      console.error(
        `Failed to set quantity: ${product} | Expected = ${expected} | Actual = ${input.value}`,
      );
      break;
    }

    const countButton = document.querySelector(
      'button[data-testid="submit-count"]',
    );

    if (!countButton) {
      console.error("Count button not found.");
      break;
    }

    countButton.click();

    console.log(`Count submitted: ${product} | Quantity = ${expected}`);

    let updated = false;

    for (let i = 0; i < 40; i++) {
      await sleep(250);

      if (window.stopMismatchAuto) {
        break;
      }

      const rows = getAllRows();

      const sameRow = rows.find(
        (r) =>
          r.querySelector('[data-testid="badgeHeader"]')?.innerText.trim() ===
          product,
      );

      if (!sameRow) {
        updated = true;
        break;
      }

      if (!sameRow.querySelector("i.fa-dot-circle-o")) {
        updated = true;
        break;
      }
    }

    if (window.stopMismatchAuto) {
      console.log("Process stopped.");
      break;
    }

    if (!updated) {
      console.error(
        `Mismatch status did not change within 10 seconds: ${product}`,
      );
      break;
    }

    processed++;

    console.log(`Completed items: ${processed}`);

    await sleep(600);
  }

  console.log(`Mismatch auto-count finished. Total completed: ${processed}`);
})();
