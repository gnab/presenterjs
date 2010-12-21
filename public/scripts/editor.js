define(['element'], function (Element) {

  Editor.inherit(Element);

  function Editor(id, presentation) {
    var self = this, onInput;

    Element.call(this, '#' + id);

    this._toolbarElement = new Element(this.children('.toolbar'));
    this._textElement = new Element(this.children('textarea'));
    this._margin = 20;
    this._tabWidth = 2;

    loadToolbarCommands(this);
    loadAutoIndent(this);
    loadSoftTabs(this);
    loadSoftTabsBackspace(this);

    presentation.bind('slideChanged', function (e, index, slide) {
      self._textElement.val(slide.content());
    });

    onInput = function () {
      var slide = presentation.getCurrentSlide();

      if (slide) {
        slide.content(self._textElement.val());
      }
    };

    this._textElement.bind('keyup', onInput);
    this._textElement.bind('paste', onInput);
  }

  function loadToolbarCommands(self) {
    self._toolbarElement.children('.bold').bind('click', function () {
      surroundSelection(self, '__', '__');
    });

    self._toolbarElement.children('.italic').bind('click', function () {
      surroundSelection(self, '_', '_');
    });

    self._toolbarElement.children('.link').bind('click', function () {
      surroundSelection(self, '[', '](http://)');
    });

    self._toolbarElement.children('.inline-code').bind('click',function () {
      surroundSelection(self, '`', '`');
    });

    self._toolbarElement.children('.code').bind('click',function () {
      surroundSelection(self, '\n\n    ', '');
    });
  }

  function surroundSelection(self, before, after) {
    var text = self._textElement.val(),
        selection = getSelection(self);

    selection.text = before + selection.text + after;
    selection.start += before.length;
    selection.end += before.length;

    setSelection(self, selection);
  }

  function loadAutoIndent(self) {
    self._textElement.bind('keydown', function (e) {
      var indent, selection;

      if (e.keyCode === 13) {
        indent = getCurrentLineIndent(self);
        selection = getSelection(self);

        selection.text = '\n' + repeatCharacter(' ', indent);
        selection.start += 1 + indent;
        selection.end = selection.start;
        
        setSelection(self, selection);

        return false;
      }
    });
  }

  function getCurrentLineIndent(self) {
    var text = self._textElement.val(),
        pos = getSelection(self).start,
        indent = 0;

    while (pos > 0 && text[pos - 1] !== '\n') { pos--; }
    while (text[pos++] === ' ') { indent++; }

    return indent;
  }

  function loadSoftTabs(self) {
    self._textElement.bind('keydown', function (e) {
      var pos, spaces, selection;

      if (e.keyCode === 9) { 
        selection = getSelection(self);
        pos = getCurrentLinePos(self);
        spaces = pos % self._tabWidth || self._tabWidth;
  
        selection.text = repeatCharacter(' ', spaces);
        selection.start += spaces;
        selection.end = selection.start;

        setSelection(self, selection);
        return false;
      }
    });
  }

  function loadSoftTabsBackspace(self) {
    self._textElement.bind('keydown', function (e) {
      var pos, spaces, selection;

      if (e.keyCode === 8) { 
        selection = getSelection(self);
        pos = getCurrentLinePos(self);
        spaces = getPrecedingNumberOfSpaces(self);

        if (selection.text !== '' ||
            spaces < self._tabWidth || 
            pos % self._tabWidth !== 0) {
          
            return true;
        }

        selection.text = '';
        selection.start -= spaces % self._tabWidth || self._tabWidth;
        selection.end -= spaces % self._tabWidth || self._tabWidth;

        setSelection(self, selection, false);

        return false;
      }
    });
  }

  function getSelection(self) {
    var start, end, tmp;

    start = self._textElement.selectionStart();
    end = self._textElement.selectionEnd();

    if (start > end) {
      tmp = start;
      start = end;
      end = tmp;
    }

    return {
      start: start,
      end: end,
      text: self._textElement.val().substring(start, end)
    };
  }

  function getPrecedingNumberOfSpaces(self) {
    var text = self._textElement.val(),
        start = getSelection(self).start,
        pos = start;

    while (start > 0 && text[start - 1] === ' ') {
      start--;
    }

    return pos - start;
  }

  function getCurrentLinePos(self) {
    var text = self._textElement.val(),
        start = getSelection(self).start,
        pos = start;

    while (start > 0 && text[start - 1] !== '\n') {
      start--;
    }

    return pos - start;
  }

  function repeatCharacter(character, count) {
    for (var i = 0, str = ''; i < count; i++) {
      str += character;
    }
    return str;
  }

  function setSelection(self, selection, overrideSelectionStart) {
    var text = self._textElement.val(),
        currentSelection = getSelection(self);

    if (overrideSelectionStart !== undefined) {
      currentSelection.start = selection.start;
    }

    text = text.substring(0, currentSelection.start) + selection.text + 
      text.substring(currentSelection.end);

    self._textElement.val(text);
    self._textElement.selectionStart(selection.start);
    self._textElement.selectionEnd(selection.end);
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
