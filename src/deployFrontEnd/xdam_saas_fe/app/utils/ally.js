/**
 * Focus on previous focusable element
 *
 * @export
 * @param {Array<HTMLElement>} items - array of html elements that are focusable
 */
export function focusPrev(items) {
  if (items.length === 0) {
    throw new Error('must pass array of HTMLElements');
  }

  items.some((o, i) => {
    const prev = i - 1;
    if (o === document.activeElement) {
      if (prev >= 0) {
        items[prev].focus();
      } else if (prev < 0) {
        items[items.length - 1].focus();
      }
      return true;
    }
  });
}

/**
 * Focus on next focusable element
 *
 * @export
 * @param {Array<HTMLElement>} items - array of html elements that are focusable
 */
export function focusNext(items = []) {
  if (items.length === 0) {
    throw new Error('must pass array of HTMLElements');
  }

  items.some((o, i) => {
    const next = i + 1;
    if (o === document.activeElement) {
      if (next !== items.length) {
        items[next].focus();
      } else if (next === items.length) {
        items[0].focus();
      }
      return true;
    }
  });
}

/**
 * Focus on "nth" target from array
 *
 * @export
 * @param {Array<HTMLElement>} items  - array of html elements that are focusable
 * @param {number} targetIndex        - index of element to focus on
 */
export function focusOn(items = [], targetIndex) {
  if (items.length === 0) {
    throw new Error('must pass array of HTMLElements');
  }

  if (!targetIndex) {
    throw new Error('must pass index of element to focus');
  }

  if (targetIndex < items.length && targetIndex >= 0) {
    return items[targetIndex].focus();
  } else {
    throw new Error('target index out of items range');
  }
}
