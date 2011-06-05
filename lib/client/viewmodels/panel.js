!function(context) {
  var viewmodels = context.presenter.viewmodels
    , List = viewmodels.List
    , Editor = viewmodels.Editor
    ;

  viewmodels.Panel = Panel;
  
  function Panel(commands, presentation) {
    var self = this
      , selectedTab = ko.observable()
      ;

    this.tabs = [
      new List(commands, presentation)
    , new Editor(commands, presentation.slides()[0])
    ];

    selectedTab(this.tabs[0].selected(true));
    
    this.selectTab = function(tab) {
      selectedTab().selected(false);
      tab.selected(true);
      selectedTab(tab);
    };

    this.tabTemplate = function(tab) {
      return tab.template;
    }

    this.commands = ko.dependentObservable(function () {
      return selectedTab().commands;
    });
  }
}(this);
