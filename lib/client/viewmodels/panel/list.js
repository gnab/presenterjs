!function(context) {
  var presenter = context.presenter
    , util = presenter.util
    , viewmodels = presenter.viewmodels;

  viewmodels.List = List;

  function List(commands, presentation) {
    this.name = 'List slides';
    this.template = 'listTemplate';
    this.selected = ko.observable(false);

    this.commands = [
      commands.addSlide,
      commands.removeSlide,
      commands.moveSlideUp,
      commands.moveSlideDown
    ];

    this.items = function () {
      return presentation.slides;
    }

    this.resizeItems = function (elements) {
      setTimeout(function () {
        elements.each(function (i, element) {
          util.resizeSlide($(element), true);
        });
      }, 0);
    }
  }
}(this);
