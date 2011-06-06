!function(context) {
  var presenter = context.presenter
    , util = presenter.util
    , viewmodels = presenter.viewmodels;

  viewmodels.List = List;

  function List(presentation) {
    this.name = 'List slides';
    this.template = 'listTemplate';
    this.selected = ko.observable(false);
    this.items = presentation.slides;

    this.resizeItems = function (elements) {
      setTimeout(function () {
        elements.each(function (i, element) {
          util.resizeSlide($(element), true);
        });
      }, 0);
    };

    this.addSlide = function () {};
    this.removeSlide = function () {};
    this.moveSlideUp = function () {};
    this.moveSlideDown = function () {};
  }
}(this);
