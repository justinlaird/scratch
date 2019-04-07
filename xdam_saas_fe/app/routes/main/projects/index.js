import Route from '@ember/routing/route';
import { service } from '@ember-decorators/service';
import { XuiContainerView } from 'xdam-saas-fe/viewmodels/xui-container-view';


export default class MainProjectsIndexRoute extends Route {
  @service currentUser

  async model() {
    let customerId =  await this.get('currentUser.customer.id');

    return XuiContainerView.create({
      containerId: customerId,
      containerType: 'customer',
      childTypes: ['project'],
    });
  }
}
