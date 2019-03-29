import config from './config/environment';

export default function() {

  if (config.environment === 'test') {
    this.setDefault({ duration: 0 });
  } else {
    this.setDefault({ duration: 300 });
  }

  // TODO: bind to the models getReference('modelName', model.id).parent
  // or something similar that has a) unique from and to values b) is comparable
  // e.g., same as comparison model for sorting algos
  //
  // Example url:
  // http://localhost:4200/?curr=foldergroups&next=foldergroups&pId=fg030000-0000-0000-0000-000000000000&prev=foldergroups
  this.transition(
    this.fromValue("divisions"),
    this.toValue("projects"),
    this.use('toLeft'),
    this.reverse('toRight')
  );
  this.transition(
    this.fromValue("projects"),
    this.toValue("foldergroups"),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  // rules are matched via DFS, so keep one last, its for
  // when u click My Dashboard, from any level in the navigation.
  this.transition(
    this.fromValue(true),
    this.toValue("divisions"),
    this.use('toRight'),
  );
}
