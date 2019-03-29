import Component from '@ember/component';
import { action, computed, on } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { argument } from '@ember-decorators/argument';
import { type, optional } from '@ember-decorators/argument/type';
import { getOwner }  from '@ember/application';
import { waitForProperty } from 'ember-concurrency';
import { debounce } from '@ember/runloop';
import { EKMixin, keyDown } from 'ember-keyboard';
import { alias } from '@ember-decorators/object/computed';
import { attribute, classNames } from '@ember-decorators/component';
import createFocusTrap from 'focus-trap';

import { task } from 'xdam-saas-fe/utils/macros';
import { FilterOps } from  'xdam-saas-fe/utils/filters';
import { focusNext, focusPrev } from  'xdam-saas-fe/utils/ally';

@classNames('xui-rail-project-selector')
export default class XuiRailProjectSelector extends Component.extend(EKMixin) {
  @service
  store;

  @service
  router;

  @service
  currentUser;

  @argument
  @type('object')
  railActions;

  @type('boolean')
  keyboardActivated = true;

  @attribute('tabindex')
  tabindex = -1;

  @type(optional('string'))
  projectNameFilter;

  @computed
  get mainController() {
    return getOwner(this).lookup('controller:main');
  }

  @alias('mainController.activeProject')
  activeProject;

  @task(function * () {
    const query = {
      page: { limit: 25 },
      filter: { customer: this.get('currentUser.customer.id') },
      fields: { projects: 'name' },
      sort: 'name',
      include: 'customer',
    };

    if (this.get('projectNameFilter')) {
      query.filter.name = `${FilterOps.in}${this.get('projectNameFilter')}`;
    }

    const projects = yield this.store.query('project', query);
    return projects;
  })
  fetchProjects;

  @action
  selectProject(id) {
    this.router.transitionTo('main.projects.show', id); // async-no-return

    if (this.get('mainController.project') === id) {
      return this.railActions.lastPanel();
    } else {
      this.set('mainController.project', id);
      waitForProperty(this.get('mainController.activeProject'), 'isRunning', true)
        .then(() => this.railActions.lastPanel());
    }
  }

  filterProjects() {
    this.get('fetchProjects').perform();
  }

  @action
  handleKeyDown(evt) {
    evt.stopPropagation();

    if (evt.keyCode === 40) {
      return focusNext(Array.from(this.element.querySelectorAll('[tabindex="0"]')));
    } else if (evt.keyCode === 38) {
      return focusPrev(Array.from(this.element.querySelectorAll('[tabindex="0"]')));
    } else {
      return debounce(this, this.filterProjects, 100);
    }
  }

  /* ============ Begin Events ============ */

  @on(keyDown('Enter'))
  enterKey() {
    if (document.activeElement.dataset.selectProject) {
      return this.send('selectProject', document.activeElement.dataset.selectProject);
    }
  }

  @on(keyDown('ArrowDown'))
  arrowDownKey() {
    return focusNext(Array.from(this.element.querySelectorAll('[tabindex="0"]')));
  }

  @on(keyDown('ArrowUp'))
  arrowUpKey() {
    return focusPrev(Array.from(this.element.querySelectorAll('[tabindex="0"]')));
  }

  click() {
    this.focusTrap.activate();
  }

  /* ============ End Events ============ */

  /* ============ Begin Life Cycle Hooks ============ */

  constructor() {
    super(...arguments);
    this.get('fetchProjects').perform();
  }

  willDestroyElement() {
    this.focusTrap.deactivate();
  }

  didInsertElement() {
    this.focusTrap = createFocusTrap(this.element, {
      onActivate: () => {
        this.element.classList.toggle("trap-is-active");
        this.set('keyboardActivated', true);
      },
      onDeactivate: () => {
        this.element.classList.toggle("trap-is-active");
        this.set('keyboardActivated', false);
      },
      initialFocus: 'input[type="search"]',
      clickOutsideDeactivates: true,
    });

    this.focusTrap.activate();
  }

  /* ============ End Life Cycle Hooks ============ */
}
