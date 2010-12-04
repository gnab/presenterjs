define(['common'], function (common) {

  function wrapEditor() {
    var containerElement = $('#editor'),
        textElement = containerElement.children('textarea'),
        margin = 20;

    editor = {
      resize: function (left, top, width, height) {
        common.resizeElement(containerElement, left, top, width, height);
        common.resizeElement(textElement, margin, margin,
          width - margin * 2 - 4, height - margin * 2 - 4);
      },
      content: function (content) {
        if (content !== undefined) {
          textElement.val(content);
        }
        return textElement.val();
      },
      width: function () {
        return containerElement.outerWidth();
      },
      hide: function () { 
        containerElement.hide();
      },
      show: function () {
        containerElement.show();
      }
    };

    createInputNotifier(editor, textElement);

    return editor;
  }

  function createInputNotifier(editor, textElement) {
    inputNotifier = function () {
      $(editor).trigger('input');
    };

    textElement.bind("keyup", inputNotifier);
    textElement.bind("paste", inputNotifier);
  }

  return wrapEditor();
});
