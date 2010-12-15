define(['element'], function (Element) {

  Editor.inherit(Element);

  function Editor(id) {
    var self, onInput;

    Element.call(this, '#' + id);
    this._textElement = new Element(this.children('textarea'));
    this._margin = 20;

    self = this;
    onInput = function () {
      self.trigger('input');
    };

    this._textElement.bind("keyup", onInput);
    this._textElement.bind("paste", onInput);
  }

  Editor.prototype.resize = function (left, top, width, height) {
    this.resizeElement(left, top, width, height);
    this._textElement.resizeElement(this._margin, this._margin,
      width - this._margin * 2 - 4, height - this._margin * 2 - 4);
  };

  Editor.prototype.focus = function () {
    this._textElement.focus();
  };

  Editor.prototype.content = function (content) {
    if (content !== undefined) {
      this._textElement.val(content);
    }
    return this._textElement.val();
  };

  return Editor;

});
