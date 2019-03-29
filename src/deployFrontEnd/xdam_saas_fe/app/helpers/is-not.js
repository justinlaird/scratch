import { helper } from '@ember/component/helper';

export function isNot([lhs, rhs] /*, hash*/) {
  if (typeof lhs === 'boolean') return !lhs;
  return lhs !== rhs;
}

export default helper(isNot);
