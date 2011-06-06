!function(context) {
  var viewmodels = context.presenter.viewmodels
    , List = viewmodels.List
    , Editor = viewmodels.Editor
    ;

  viewmodels.Panel = Panel;
  
  function Panel(presentation) {
    var self = this
      , selectedTab = ko.observable()
      ;

    this.tabs = [
      new List(presentation)
    , new Editor(presentation.slides()[0])
    ];

    var firstTab = this.tabs[0];
    firstTab.selected(true);
    selectedTab(firstTab);
    
    this.selectTab = function(tab) {
      selectedTab().selected(false);
      tab.selected(true);
      selectedTab(tab);
    };

    this.contentTemplate = function(tab) {
      return tab.template;
    }
  }
}(this);
