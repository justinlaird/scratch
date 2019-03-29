import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';
import { type, oneOf } from '@ember-decorators/argument/type';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';
import { MDCMenuSurface, Corner } from '@material/menu-surface';
import { schedule } from '@ember/runloop';
import { service } from '@ember-decorators/service';

@classNames('xui-menu')
export default class XuiMenuWrapperComponent extends Component {
  initialized = false;

  @service
  media;

  /* ========= Begin Arguments ========= */

  @argument
  @type(oneOf(...Object.keys(Corner)))
  anchor = 'BOTTOM_LEFT';

  @argument
  @type(oneOf('click', 'mouseEnter', 'contextMenu'))
  eventType = 'click';

  /* ========= End Arguments ========= */

  handleOpening(evt) {
    if (this.get('media.isTablet')) {
      this.mdcComponent.setFixedPosition(true);
    } else if (this.eventType === 'contextMenu') {
      this.mdcComponent.setAbsolutePosition(evt.clientX, evt.clientY);
    } else {
      this.mdcComponent.setAnchorCorner(Corner[this.anchor]);
    }

    this.mdcComponent.open = true;
  }

  @action
  openMenu(evt) {
    if (this.initialized === true) {
      return this.handleOpening(evt);
    }

    this.set('initialized', true);

    schedule('afterRender', () => {
      this.mdcComponent = new MDCMenuSurface(this.element.querySelector('.xui-menu-surface'));
      this.mdcComponent.hoistMenuToBody();
      return this.handleOpening(evt);
    });
  }

  @action
  closeMenu() {
    this.mdcComponent.open = false;
  }

  willDestroyElement() {
    this._super(...arguments);
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }
}
