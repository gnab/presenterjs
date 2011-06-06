!function(context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Editor = Editor;

  function Editor(slide) {
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

    this.formatBold = function () {};
    this.formatItalic = function () {};
    this.formatLink = function () {};
    this.formatInlineCode = function () {};
    this.formatCodeBlock = function () {};
  }
}(this);
