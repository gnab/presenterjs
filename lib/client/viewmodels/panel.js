!function(context) {
  var viewmodels = context.presenter.viewmodels
    , List = viewmodels.List
    , Editor = viewmodels.Editor
    ;

  viewmodels.Panel = Panel;
  
  function Panel(commands) {
    var self = this
      , selectedTab = ko.observable()
      ;

    this.tabs = [
      new List(commands)
    , new Editor(commands)
    ];

    selectedTab(this.tabs[0].selected(true));

    this.selectTab = function(tab) {
      selectedTab().selected(false);
      selectedTab(tab.selected(true));
    };

    this.tabTemplate = function(tab) {
      return tab.template;
    }

    this.commands = ko.dependentObservable(function () {
      return selectedTab().commands;
    });
  }
}(this);
