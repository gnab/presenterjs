!function(context) {
  var viewmodels = context.presenter.viewmodels
    , List = viewmodels.List
    , Editor = viewmodels.Editor
    , Tab = viewmodels.Tab;

  viewmodels.Panel = Panel;
  
  function Panel(commands) {
    var self = this;

    this.list = new List(commands);
    this.editor = new Editor(commands);

    this.selectedTab = ko.observable();
    this.tabs = [
      new Tab('List slides', this, this.list)
    , new Tab('Edit slide', this, this.editor)
    ];

    this.selectedTab(this.tabs[0]);

    this.commands = ko.dependentObservable(function () {
      return self.selectedTab().content.commands;
    });
  }
}(this);
