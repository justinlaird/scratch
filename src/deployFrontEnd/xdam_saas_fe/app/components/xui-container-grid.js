import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware';
import { A }  from '@ember/array';
import { inject } from '@ember/service';
import { computed }  from '@ember/object';

export default Component.extend(ResizeAware, {
  media: inject(),
  layoutManager: inject(),
  classNames: ['xui-container-grid-wrapper'],

  CARD_WIDTHS: A([
    [2200, '10%'],
    [1900, '12.5%'],
    [1500, '14.28%'],
    [1250, '16.66%'],
    [1000, '20%'],
    [750, '25%'],
    [540, '33.33%'],
    [360, '50%'],
    [0, '100%'],
  ]),

  /*
  TODO: if rail is shown, the lookupResult block no longer throws (check git log)
  to see how it did throw for reference).

  However, this brought to my attention a different issue. When the rail is toggled
  open in desktop, upon resize we get full screen cards. But there is no button
  atm to toggle the menu(sidenav) vs cards in mobile if you didn't start in desktop.

  EDIT: The above comment actually is a semi-related symptom of a different bug:
    - the only way in non desktop mode to see folder 1, which is the top level
      folder in the sidenav hierarchy, is to go to child folder, like folder
      5 in the current seed data used, then click the back button, which will
      bring you to folder 1's main page. In an ancient iteration of the sidebar
      and main panels that I wrote this was not an issue, so when this is fixed,
      keep this in mind for context, as I it makes sense in context of work I did
      previously to make this work.

  Future self and friends, fyi.
  */
  baseWidth: window.innerWidth,
  cardZoom: 0,
  cardHeightRatio: 1,
  cardWidth: computed(
    'cardZoom',
    'baseWidth',
    'defaultCardWidths',
    'layoutManager.{leftRail,rightRail}.width',
    function(){
      let elementWidth = this.baseWidth;
      elementWidth -= this.get('layoutManager.leftRail.width');
      elementWidth -= this.get('layoutManager.rightRail.width');
      elementWidth -= (this.cardZoom * elementWidth);

      const lookupResult = this.CARD_WIDTHS.find(([size]) => elementWidth >= size);
      if (lookupResult) {
        return lookupResult[1];
      } else {
        return '100%';
      }
    }
  ),

  resizeHeightSensitive: false,
  debouncedDidResize(width, height, evt) {
    this.set('baseWidth', window.innerWidth);
  },
});
