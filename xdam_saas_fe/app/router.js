import EmberRouter from '@ember/routing/router';
import config from './config/environment';

/* istanbul ignore next */
const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

/* istanbul ignore next */
Router.map(function () {
  this.route('login');
  this.route('swagger');
  this.route('playground', function() {
    this.route('cards');
  });

  this.route('main', { path: '' }, function() {
    this.route('projects', function() {
      this.route('show', {path: ':project_id'});
      this.route('budget', {path: ':project_id/budget'});
      this.route('task-manager', {path: ':project_id/task-manager'});
    });
    this.route('folders', function() {
      this.route('show', {path: ':folder_id'});
    });
    this.route('collections', function() {
      this.route('show', {path: ':collection_id'});
    });
    this.route('settings');
  });
  this.route('style-guide');
});

export default Router;
