import Route from '@ember/routing/route';


export default Route.extend({
  //Do not repeat this pattern for other routes, this is a tool only used in development mode.  It causes the entire DOM tree to be re-rendered
  activate() {
    this._super(...arguments);
    document.body.parentElement.classList.add("swagger-ui-background");
  },
  deactivate() {
    this._super(...arguments);
    document.body.parentElement.classList.remove("swagger-ui-background");
  }
});
