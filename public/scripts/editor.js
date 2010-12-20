define(['element'], function (Element) {

  Editor.inherit(Element);

  function Editor(id, presentation) {
    var self = this, onInput;

    Element.call(this, '#' + id);

    this._toolbarElement = new Element(this.children('.toolbar'));
    this._textElement = new Element(this.children('textarea'));
    this._margin = 20;

    loadToolbarCommands(this);
    loadAutoIndent(this);
    loadSoftTabs(this);

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
      self.surroundSelection('__', '__');
    });

    self._toolbarElement.children('.italic').bind('click', function () {
      self.surroundSelection('_', '_');
    });

    self._toolbarElement.children('.link').bind('click', function () {
      self.surroundSelection('[', '](http://)');
    });

    self._toolbarElement.children('.inline-code').bind('click',function () {
      self.surroundSelection('`', '`');
    });

    self._toolbarElement.children('.code').bind('click',function () {
      self.surroundSelection('\n\n    ', '');
    });
  }

  function loadAutoIndent(self) {
    self._textElement.bind('keydown', function (e) {
      var text, pos, start, i, indent, indentedText;

      if (e.keyCode === 13) {
        text = self._textElement.val();
        pos = Math.min(self._textElement.selectionStart(),
          self._textElement.selectionEnd());

        start = pos; 
        while (start > 0 && text[start - 1] !== '\n') {
          start--;
        }

        indent = 0;
        while (text[start] === ' ') {
          start++;
          indent++;
        }

        indentedText = text.substring(0, pos) + '\n';
        for (i = 0; i < indent; i++) {
          indentedText += ' ';
        }
        indentedText += text.substring(pos);

        self._textElement.val(indentedText);
        pos += 1 + indent;
        self._textElement.selectionStart(pos);
        self._textElement.selectionEnd(pos);
        indent = 0;

        return false;
      }
    });
  }

  function loadSoftTabs(self) {
    self._textElement.bind('keydown', function (e) {
      var text, pos, start, i, spaces, tabWidth = 2, tabbedText;

      if (e.keyCode === 8 || e.keyCode === 9) {
        text = self._textElement.val();
        pos = Math.min(self._textElement.selectionStart(),
          self._textElement.selectionEnd());
        start = pos;

        if (e.keyCode === 8) { // backspace
          if (self.getSelection() !== '') {
            return true;
          }

          while (start > 0 && text[start - 1] === ' ') {
            start--;
          }

          if (pos - start < tabWidth || (pos - start) % tabWidth !== 0) {
            return true;
          }

          text = text.substring(0, pos - tabWidth) + text.substring(pos);

          pos -= tabWidth;
        }
        else if (e.keyCode === 9) { // tab
          while (start > 0 && text[start - 1] !== '\n') {
            start--;
          }

          spaces = (pos - start) % tabWidth || tabWidth;
    
          tabbedText = text.substring(0, pos);
          for (i = 0; i < spaces; i++) {
            tabbedText += ' ';
          }
          tabbedText += text.substring(pos);

          text = tabbedText;
          pos += spaces;
        }

        self._textElement.val(text);
        self._textElement.selectionStart(pos);
        self._textElement.selectionEnd(pos);

        return false;
      }
    });
  }

  Editor.prototype.getSelection = function () {
    var start, end;

    start = this._textElement.selectionStart();
    end = this._textElement.selectionEnd();

    return this._textElement.val().substring(start, end);
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
