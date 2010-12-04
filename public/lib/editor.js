define(['common'], function (common) {

  var dependenciesLoaded = false, delayedCreators = [];

  function create(id, callback) {
    if (dependenciesLoaded) {
      createEditor(id, callback);
    }
    else {
      delayedCreators.push({ id: id, callback: callback });
    }
  }

  function createEditor(id, callback) {
    var containerElement = $('#' + id),
        editorElement = $('<textarea />'),
        editorInputNotifier,
        margin = 10;

    containerElement.css({
      background: '#fff',
      'border-right': '4px solid #ccc',
      height: '100%',
      position: 'absolute'
    });

    editorElement.css({
      border: '0',
      position: 'relative'
    });

    containerElement.append(editorElement);

    editor = {
      resize: function (left, top, width, height) {
        common.resizeElement(containerElement, left, top, width, height);
        common.resizeElement(editorElement, left + margin, top + margin,
          width - margin * 2, height - margin * 2);
      },
      content: function (content) {
        if (content !== undefined) {
          editorElement.val(content);
        }
        return editorElement.val();
      },
      width: function () {
        return containerElement.outerWidth();
      }
    };

    editorInputNotifier = function () {
      $(editor).trigger('input');
    };

    editorElement.bind("keyup", editorInputNotifier);
    editorElement.bind("paste", editorInputNotifier);

    callback(editor);
  }

  function loadDependencies() {
    require([
      'vendor/jquery-1.4.4.min', 
      'vendor/showdown',
      'vendor/html-sanitizer-minified',
      'vendor/highlight.min'
    ]);

    require.ready(function () {
      dependenciesLoaded = true;
      loadDelayedCreators();
    });
  }

  function loadDelayedCreators() {
    var key, creator;

    for (key in delayedCreators) {
      if (delayedCreators.hasOwnProperty(key)) {
        creator = delayedCreators[key]; 
        createEditor(creator.id, creator.callback);
      }
    }
  }

  loadDependencies();

  return { create: create };
});
