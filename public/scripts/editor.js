define(['element'], function (Element) {

  Editor.inherit(Element);

  function Editor(id, presentation) {
    var self = this, onContentChanged;

    Element.call(this, '#' + id);

    this._toolbarElement = new Element(this.children('.toolbar'));
    this._textElement = new Element(this.children('textarea'));
    this._margin = 20;

    this._toolbarElement.children('.bold').bind('click', function () {
      self.surroundSelection('__', '__');
    });

    this._toolbarElement.children('.italic').bind('click', function () {
      self.surroundSelection('_', '_');
    });

    this._toolbarElement.children('.link').bind('click', function () {
      self.surroundSelection('[', '](http://)');
    });

    this._toolbarElement.children('.inline-code').bind('click',function () {
      self.surroundSelection('`', '`');
    });

    this._toolbarElement.children('.code').bind('click',function () {
      self.surroundSelection('\n\n    ', '');
    });

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

  Editor.prototype.surroundSelection = function (before, after) {
    var start, end, tmp, text, selection;

    start = this._textElement.selectionStart();
    end = this._textElement.selectionEnd();

    if (start > end) {
      tmp = start;
      start = end;
      end = tmp;
    }

    text = this._textElement.val();
    selection = text.substring(start, end);

    text = text.substring(0, start) + before + selection + after +
      text.substring(end);

    this._textElement.val(text);

    start += before.length;
    end += before.length;

    this._textElement.selectionStart(start);
    this._textElement.selectionEnd(end);
  }

  Editor.prototype.resize = function (left, top, width, height) {
    var toolbarHeight = this._toolbarElement.height();

    this.resizeElement(left, top, width, height);
    this._textElement.resizeElement(this._margin, this._margin,
      width - this._margin * 2 - 4, height - this._margin * 2 - 4 -
      toolbarHeight);
  };

  Editor.prototype.focus = function () {
    this._textElement.focus();
  };

  Editor.prototype.blur = function () {
    this._textElement.blur();
  };

  return Editor;

});
