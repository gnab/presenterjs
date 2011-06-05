!function(context) {
  var presenter = context.presenter
    , viewmodels = presenter.viewmodels
    , Command = presenter.models.Command
    , Panel = viewmodels.Panel
    , Presentation = viewmodels.Presentation
    , util = presenter.util
    ;

  viewmodels.Presenter = Presenter;

  function Presenter (name, content) {
    var commands = {
      addSlide: new Command('Add')
    , removeSlide: new Command('Remove')
    , moveSlideUp: new Command('Up')
    , moveSlideDown: new Command('Down')

    , formatBold: new Command('Bold', true)
    , formatItalic: new Command('Italic', true)
    , formatLink: new Command('Link')
    , formatInlineCode: new Command('Inline Code')
    , formatCodeBlock: new Command('Code block')
    };

    this.presentation = new Presentation(name, content);
    this.panel = new Panel(commands, this.presentation);

    this.resizeSlide = function () {
      setTimeout(function () {
        util.resizeSlide($('#presenter'));
      }, 0);
    };

    ko.applyBindings(this);
  }
}(this);
