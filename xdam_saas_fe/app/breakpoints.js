import sassVariables from 'xdam-saas-fe/utils/sass-variables';

// this is used by ember-responsive to determine the media queries
// see: https://www.npmjs.com/package/ember-responsive
export default {
  mobile:      `(max-width: ${sassVariables['$xui-breakpoints'].tablet}px)`,
  tablet:      `(max-width: ${sassVariables['$xui-breakpoints'].desktop}px)`,
  desktop:     `(min-width: ${sassVariables['$xui-breakpoints'].desktop}px)`,
};
