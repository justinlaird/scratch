import { htmlSafe, dasherize }  from '@ember/string';

// Lifted from React
const isUnitlessNumber = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

function transformStyleValue(key, value) {
  if (value === '') {
    throw new Error(`Value cannot be empty for ${key} property`);
  }

  if (isUnitlessNumber.hasOwnProperty(key)) {
    if (typeof value === 'number') {
      return `${dasherize(key)}:${value}`;
    } else {
      throw new Error(`Style property ${key} should have a number value`);
    }
  } else if (typeof value === 'string') {
    return `${dasherize(key)}:${value}`;
  } else {
    throw new Error(`Invalid value for ${key} property`);
  }
}

export default function styleString(styles = {}) {
  if (styles !== null && typeof styles === 'object' && styles.length === undefined) {
    let styleString = Object.entries(styles)
      .map(([key, value]) => transformStyleValue(key, value))
      .join(';');

    if (styleString.length > 1 && styleString.charAt(styleString.length - 1) !== ';') {
      styleString += ';';
    }

    return htmlSafe(styleString);
  } else {
    throw new Error(`styles argument must be an Object data type`);
  }
}
