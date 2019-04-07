import Controller from '@ember/controller';
import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

import { mainQueryParams } from 'xdam-saas-fe/mixins/query-params';
import { taskDrop } from 'xdam-saas-fe/utils/macros';

export default class MainController extends Controller.extend(mainQueryParams) {
  @service
  currentUser;

  @service
  activeContainer;

  @or('queryParamsState.{project}.changed')
  queryParamsChanged;

  setup(/* { queryParams } */) {
    // This is where we'll apply queryParamDefaults for values fetched from API. Note, you must use resetQueryParams()
    // for each specific new default value. Do not reset all query params.
    if (this.project === '') {
      this.setDefaultQueryParamValue('project', this.get('currentUser.customer.projects.firstObject.id'));
      this.resetQueryParams('project');
    }

    this.fetchData(this.get('allQueryParams'));
  }

  queryParamsDidChange({ shouldRefresh, changed }) {
    if (shouldRefresh) {
      this.fetchData(changed);
    }
  }

  reset({ queryParams }, isExiting) {
    if (isExiting) {
      this.resetQueryParams();
    }
  }

  fetchData(params) {
    if (params.project) {
      return this.get('activeProject').perform(params.project);
    }
  }

  @action
  resetAll() {
    this.resetQueryParams();
  }

  @taskDrop(function * (id){
    return yield this.store.query('project', {
      include: 'rootFolder.folders.collections,rootFolder.folders.folders,rootFolder.collections',
      fields: { projects: 'name', collections: 'name', folders: 'name' },
      filter: { id },
    }).then(result => result.get('firstObject'));
  })
  activeProject;
}
