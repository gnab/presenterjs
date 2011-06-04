!function (context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Tab = Tab;
  
  function Tab (name, content) {
    var self = this;

    this.name = name;
    this.content = content;

    this.selected = ko.observable(false);
  }
}(this);
