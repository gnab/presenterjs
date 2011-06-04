!function(context) {
  var viewmodels = context.presenter.viewmodels
    , List = viewmodels.List
    , Editor = viewmodels.Editor
    , Tab = viewmodels.Tab;

  viewmodels.Panel = Panel;
  
  function Panel(commands) {
    var self = this
      , selectedTab = ko.observable()
      ;

    this.list = new List(commands);
    this.editor = new Editor(commands);

    this.tabs = [
      new Tab('List slides', this.list)
    , new Tab('Edit slide', this.editor)
    ];

    selectedTab(this.tabs[0].selected(true));

    this.selectTab = function(tab) {
      selectedTab().selected(false);
      selectedTab(tab.selected(true));
    };

    this.commands = ko.dependentObservable(function () {
      return selectedTab().content.commands;
    });
  }
}(this);
