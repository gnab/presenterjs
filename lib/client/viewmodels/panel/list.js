!function(context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.List = List;

  function List(commands) {
    this.name = 'List slides';
    this.template = 'listTemplate';
    this.selected = ko.observable(false);

    this.commands = [
      commands.addSlide,
      commands.removeSlide,
      commands.moveSlideUp,
      commands.moveSlideDown
    ];
  }
}(this);
