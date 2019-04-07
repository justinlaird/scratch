import { helper } from '@ember/component/helper';
import { htmlSafe } from "@ember/string";

export function backgroundImage(params/*, hash*/) {
  return htmlSafe(`background-image: url('${params[0]}')`);
}

export default helper(backgroundImage);
