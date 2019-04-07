import layout from '../templates/components/swagger-ui';
import Swag from 'swagger-ui-dist';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { copy } from 'ember-copy';


const { SwaggerUIBundle } = Swag;

export default Component.extend({
  session: service(),
  layout,
  classNames: ['swagger-ui', 'component-swagger-ui'],

  didRender() {
    this._super(...arguments);

    let config = copy(this.config || { deepLinking: false });
    if (!config.dom_id) {
      config.dom_id = `#${this.elementId}`;
    }

    window.SwaggerUi = SwaggerUIBundle(config);
  }
});

