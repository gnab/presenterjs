!function(context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.List = List;

  function List(commands) {
    this.commands = [
      commands.addSlide,
      commands.removeSlide,
      commands.moveSlideUp,
      commands.moveSlideDown
    ];
    this.visible = ko.observable(false);
  }
}(this);
