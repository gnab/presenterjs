!function(context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Editor = Editor;

  function Editor(commands) {
    this.commands = [
      commands.formatBold
    , commands.formatItalic
    , commands.formatLink
    , commands.formatInlineCode
    , commands.formatCodeBlock
    ];
    this.visible = ko.observable(false);
  }
}(this);
