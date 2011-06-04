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

    this.tabs = [
      new Tab('List slides', this.list)
    , new Tab('Edit slide', this.editor)
    ];

    this.selectedTab = ko.observable();
    this.selectTab(this.tabs[0]);

    this.commands = ko.dependentObservable(function () {
      return self.selectedTab().content.commands;
    });
  }

  Panel.prototype.selectTab = function(tab) {
    if (this.selectedTab()) {
      this.selectedTab().selected(false);
    }
    this.selectedTab(tab);
    tab.selected(true);
  }
}(this);
