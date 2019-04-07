'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    "no-bare-strings": true,
    "no-inline-styles": false,      // ALLOWED, SPECIAL CASE - if you use htmlSafe for security, when building the string.
    "attribute-indentation": false, // NEEDS HELP FIXING APP WIDE
    "block-indentation": false,     // NEEDS HELP FIXING APP WIDE
  },
};

/*
current defaults: https://github.com/ember-template-lint/ember-template-lint/blob/master/lib/config/recommended.js

    'attribute-indentation': true,
    'block-indentation': true,
    'deprecated-render-helper': true,
    'img-alt-attributes': true,
    'linebreak-style': true,
    'link-rel-noopener': true,
    'no-attrs-in-components': true,
    'no-debugger': true,
    'no-duplicate-attributes': true,
    'no-html-comments': true,
    'no-inline-styles': true,
    'no-input-block': true,
    'no-input-tagname': true,
    'no-invalid-interactive': true,
    'no-log': true,
    'no-nested-interactive': true,
    'no-outlet-outside-routes': true,
    'no-partial': true,
    'no-quoteless-attributes': true,
    'no-shadowed-elements': true,
    'no-triple-curlies': true,
    'no-unbound': true,
    'no-unnecessary-concat': true,
    'no-unused-block-params': true,
    'quotes': 'double',
    'self-closing-void-elements': true,
    'simple-unless': true,
    'style-concatenation': true,
    'table-groups': true,

  -------- GUIDE TO BREAKING THE RULES --------

    These rules are just as important as eslint rules.

    Invalid use of hbs is likely to:

      a) cause a bug
      b) break html5 symantics,
        - and thus de-opt glimmer (now or in future)
        - de-opt certain browsers (now or in future)
      d) MAKE CODE HARDER TO CHANGE, understand, or re-use

    Now that you know NOT to break the rules, we give you HOW to break them,
    correctly, if you do, which includes 2 rules: (fun yeah!)

      1) DISABLE ONLY FOR THAT LINE, OTHERWISE IT WILL DISABLE THE RULE FOR THE WHOLE FILE
      2) If u disable for the whole file on purpose, add {{! DISABLE WHOLE FILE OK }} or something indicating u meant to do that
      2) Name the rule(s) your disabling for a line, space separated

  Examples:

    <!-- disable all rules, NEVER USE THIS ONE, be specific! -->
    {{! template-lint-disable }}

    <!-- disable no-bare-strings -->
    {{! template-lint-disable no-bare-strings }}

    <!-- disable no-bare-strings and no-triple-curlies -->
    {{! template-lint-disable no-bare-strings no-triple-curlies }}

    <!-- disable no-bare-strings for a whole file -->
    {{! template-lint-disable no-bare-strings }}

  RULES YOU CANT DISABLE INLINE atm:
    - simple-unless

  Other non parser caught style team rules:
    - Place actions at the beginning of a dom tag, this makes it easy to spot
      user interactions associated with tags in our hbs. Also, consistency.
    - Place html attributes, like class, alt, src, tabindex on their own
      line, in order of importance.


  -------- Event Reference Notes: --------
    - inline html actions are handled differently than class backed {{curly-component}}
      actions:
        - https://ember-twiddle.com/3de2f20b58797f1add3214c49be7fcdd
    - jqueury makes this more complicated. it will be removed soon, but
      in the meantime, be aware of its event propagation complexities:
        - https://ember-twiddle.com/847601d7383bc60052b4
*/
