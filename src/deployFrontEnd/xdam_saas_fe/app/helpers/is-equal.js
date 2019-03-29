import { helper } from '@ember/component/helper';

export function isEqual([lhs, rhs]/*, hash*/) {
  return lhs === rhs;
}

export default helper(isEqual);
