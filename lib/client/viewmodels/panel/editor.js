!function(context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Editor = Editor;

  function Editor(commands, slide) {
    this.name = 'Edit slide';
    this.template = 'editorTemplate';
    this._selected = ko.observable(false);
    this.selected = ko.dependentObservable({
      read: function () {
        return this._selected();
      }
    , write: function (value) {
        if (!value) {
          $(document).trigger('save');
        }
        this._selected(value);
        return this;
      }
    , owner: this
    });

    this.slide = slide;

    this.commands = [
      commands.formatBold
    , commands.formatItalic
    , commands.formatLink
    , commands.formatInlineCode
    , commands.formatCodeBlock
    ];
  }
}(this);
