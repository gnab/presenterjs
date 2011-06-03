!function(context) {
  var Command = context.presenter.models.Command
    , Panel = context.presenter.viewmodels.Panel;

  function Presenter() {
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

    this.panel = new Panel(commands);
  }

  ko.applyBindings(new Presenter());
}(this);
