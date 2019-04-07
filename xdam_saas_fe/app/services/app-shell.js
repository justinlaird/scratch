import { A }  from '@ember/array';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { service } from '@ember-decorators/service';
import { computed, action } from '@ember-decorators/object';
import screenfull from 'screenfull';

export default class AppShell extends Service {
  @service
  session;

  @service
  store;

  @service
  router;

  @service
  media;

  @service
  intl;

  @service
  overlayManager;

  @computed('router.currentRouteName')
  get config() {

    const items = [{
      menu: 'file',
      routes: ['main.folders.show'],
      item: {
        text: this.get('intl').t('xui-top-app-bar.new-folder'),
        type: 'action',
        keyboard: '⌘⇧F',
        action: () => {
          // TODO: Since the top app bar is outside of the 'show' route, we don't know where to create a new folder.
          // Would be great to figure out a way to gain access to the current model params here...

          // this.get('overlayManager').toggleOverlay('xui-dialog-new-resource', {
          //   parentId: null,
          //   parentType: 'folder',
          //   recordType: 'folder',
          // });
        },
      },
    }, {
      menu: 'file',
      routes: ['main.folders.show'],
      item: {
        text: this.get('intl').t('xui-top-app-bar.new-collection'),
        type: 'action',
        keyboard: '⌘⇧C',
        action: () => {
          // TODO: Since the top app bar is outside of the 'show' route, we don't know where to create a new folder.
          // Would be great to figure out a way to gain access to the current model params here...

          // ANSWER: the main route is the only route we need. check git for 11833018d3e956dd5fdd9e63e4029f774ec34570
          // where this central idea was removed

          // this.get('overlayManager').toggleOverlay('xui-dialog-new-resource', {
          //   parentId: null,
          //   parentType: 'folder',
          //   recordType: 'collection',
          // });
        },
      },
    }];

    const menus = items.reduce((prev, curr) => {
      if (curr.routes.includes(this.router.currentRouteName)) {
        prev[curr.menu].items.push(curr.item);
      }
      return prev;
    }, {
      file: {
        name: this.get('intl').t('xui-top-app-bar.file'),
        items: [{
          text: this.get('intl').t('xui-top-app-bar.upload'),
          type: 'action',
          keyboard: '⌘⇧U',
          action: () => this.logger.info('Clicked menu item'),
        }]
      },
      view: {
        name: this.get('intl').t('xui-top-app-bar.view'),
        items: [{
          text: this.get('intl').t('xui-top-app-bar.fullscreen'),
          type: 'action',
          action: () => this.logger.info('Clicked menu item'),
        }]
      },
      edit: {
        name: this.get('intl').t('xui-top-app-bar.edit'),
        items: [{
          text: this.get('intl').t('xui-top-app-bar.copy'),
          type: 'action',
          action: () => this.logger.info('Clicked menu item'),
        }]
      },
      help: {
        name: this.get('intl').t('xui-top-app-bar.help'),
        items: [{
          text: this.get('intl').t('xui-top-app-bar.help-center'),
          type: 'url',
          to: 'https://xdam.com/help/HTML/index.html',
        }, {
          text: this.get('intl').t('xui-top-app-bar.contact-support'),
          type: 'url',
          to: 'https://xdam.com/help/HTML/index.html',
        }, {
          text: this.get('intl').t('xui-top-app-bar.keyboard-shortcuts'),
          keyboard: '⌘⇧K',
          type: 'action',
          action: () => this.logger.info('Clicked menu item'),
        }]
      },
    });

    const leftRailTabs = A([EmberObject.create({
      name: this.get('intl').t('xui-rail.tabs.project'),
      slug: 'project',
      icon: 'file-tree',
      type: 'primary',
      history: A(['xui-rail/project']),
    }), EmberObject.create({
      name: this.get('intl').t('xui-rail.tabs.search'),
      slug: 'search',
      icon: 'search',
      type: 'primary',
      history: A(['xui-rail/search']),
    }), EmberObject.create({
      name: this.get('intl').t('xui-rail.tabs.users'),
      slug: 'users',
      icon: 'group',
      type: 'primary',
      history: A(['xui-rail/users']),
    }), EmberObject.create({
      name: this.get('intl').t('xui-rail.tabs.notifications'),
      slug: 'notifications',
      icon: 'notification',
      type: 'primary',
      history: A(['xui-rail/notifications']),
    }), EmberObject.create({
      name: this.get('intl').t('xui-rail.tabs.settings'),
      slug: 'settings',
      icon: 'settings',
      type: 'primary',
      history: A(['xui-rail/settings']),
    }), EmberObject.create({
      name: this.get('intl').t('xui-rail.tabs.logout'),
      slug: 'logout',
      icon: 'logout',
      type: 'secondary',
      clickHandler: () => this.logout(),
    })]);

    const rightRailTabs = A([EmberObject.create({
      name: this.get('intl').t('xui-rail.tabs.info'),
      slug: 'info',
      icon: 'info',
      type: 'primary',
      history: A(['xui-rail/info']),
    }), EmberObject.create({
      name: this.get('intl').t('xui-rail.tabs.history'),
      slug: 'history',
      icon: 'history',
      type: 'primary',
      history: A(['xui-rail/history']),
    })]);

    return { menus, leftRailTabs, rightRailTabs };
  }

  @action
  toggleFullScreen() {
    if (screenfull.enabled) {
      screenfull.toggle();
    } else {
      // Ignore or do something else
    }
  }

  @action
  logout() {
    this.get('session').invalidate();
  }
}
