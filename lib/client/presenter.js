!function(context) {
  var presenter = context.presenter
    , viewmodels = presenter.viewmodels
    , Command = presenter.models.Command
    , Panel = viewmodels.Panel
    , Presentation = viewmodels.Presentation;

  viewmodels.Presenter = Presenter;

  function Presenter (content) {
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

    this.presentation = new Presentation(content);
    this.panel = new Panel(commands, this.presentation);

    ko.applyBindings(this);
  }
}(this);
