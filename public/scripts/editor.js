define(['element'], function (Element) {

  Editor.inherit(Element);

  function Editor(id, presentation) {
    var self = this, onInput;

    Element.call(this, '#' + id);
    this._textElement = new Element(this.children('textarea'));
    this._margin = 20;

    presentation.bind('slideChanged', function (e, index, slide) {
      self._textElement.val(slide.content());
    });

    onContentChanged = function () {
      var slide = presentation.getCurrentSlide();
      if (slide) {
        slide.content(self._textElement.val());
      }
    };

    this._textElement.bind("keyup", onContentChanged);
    this._textElement.bind("paste", onContentChanged);
  }

  Editor.prototype.resize = function (left, top, width, height) {
    this.resizeElement(left, top, width, height);
    this._textElement.resizeElement(this._margin, this._margin,
      width - this._margin * 2 - 4, height - this._margin * 2 - 4);
  };

  Editor.prototype.focus = function () {
    this._textElement.focus();
  };

  Editor.prototype.blur = function () {
    this._textElement.blur();
  };

  return Editor;

});
