!function (context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Tab = Tab;
  
  function Tab (name, panel, content) {
    var self = this;

    this.name = name;
    this.panel = panel;
    this.content = content;

    this.selected = ko.dependentObservable(function () {
      return self.panel.selectedTab() === self;
    });
  }

  Tab.prototype.select = function () {
    this.panel.selectedTab(this);
  };
}(this);
