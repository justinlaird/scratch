import Controller from '@ember/controller';
import Swag from 'swagger-ui-dist';
import ENV from 'xdam-saas-fe/config/environment';
import { inject as service } from '@ember/service';


export default Controller.extend({
  session: service(),
  init() {
    /* istanbul ignore next */
    this._super(...arguments);
    /* istanbul ignore next */
    const token = this.get('session.data.authenticated.jwt');
    /* istanbul ignore next */
    this.swaggerConfig = {
      url: ENV.apiHost + '/rest/swagger.json',
      presets: [
        Swag.SwaggerUIStandalonePreset, Swag.SwaggerUIBundle.presets.apis, Swag.SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout",
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 1,
      validatorUrl: 'https://online.swagger.io/validator',
      onComplete: function(){
        /* istanbul ignore next */
        window.SwaggerUi.preauthorizeApiKey('Bearer' , `Bearer ${token}`);
      }
    };
  }
});
