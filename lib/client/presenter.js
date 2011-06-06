!function(context) {
  var presenter = context.presenter
    , viewmodels = presenter.viewmodels
    , Command = presenter.models.Command
    , Panel = viewmodels.Panel
    , Presentation = viewmodels.Presentation
    , Slide = viewmodels.Slide
    , util = presenter.util
    ;

  viewmodels.Presenter = Presenter;

  function Presenter (name, content) {
    this.presentation = new Presentation(name, content);
    this.panel = new Panel(this.presentation);

    this.resizeSlide = function () {
      setTimeout(function () {
        util.resizeSlide($('#presenter'));
      }, 0);
    };

    ko.applyBindings(this);
  }
}(this);
