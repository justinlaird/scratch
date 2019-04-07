export { singularize, pluralize } from 'ember-inflector';

export function humanize(string) {
  assertString(string);

  const regex = /_+|-+/g;
  const replacement = ' ';
  const result = string.toLowerCase().replace(regex, replacement);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function titleize(string) {
  assertString(string);

  return humanize(string).toLowerCase().replace(/(?:^|\s|-|\/)\S/g, function(m) {
    return m.toUpperCase();
  });
}

function assertString(string) {
  if (typeof string !== 'string') { throw Error('Must pass string'); }
}
