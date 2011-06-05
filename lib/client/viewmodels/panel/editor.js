!function(context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Editor = Editor;

  function Editor(commands, content) {
    this.name = 'Edit slide';
    this.template = 'editorTemplate';
    this.selected = ko.observable(false);
    this.content = ko.observable(content);

    this.commands = [
      commands.formatBold
    , commands.formatItalic
    , commands.formatLink
    , commands.formatInlineCode
    , commands.formatCodeBlock
    ];
  }
}(this);
