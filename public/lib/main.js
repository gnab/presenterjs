define(['editor', 'presenter'], function (editor, presenter) {

  var container;

  function loadDependencies() {
    editor.create('editor', function (editor) {
      presenter.create('presenter', function (presenter) {
        container = $(window);
        loadEnvironment(editor, presenter);
      });
    });
  }

  function loadEnvironment(editor, presenter) {
    loadLayout(editor, presenter);
    loadEditor(editor, presenter);
  }

  function loadLayout(editor, presenter) {
    var updateLayout = function () {
      var editorWidth = Math.floor(container.width() * 0.33);

      editor.resize(0, 0, editorWidth, container.height());

      presenter.resize(
        editor.width(), 0, container.width() - editor.width(),
        container.height()
      );
    }
    container.resize(updateLayout);
    updateLayout();
  }

  function loadEditor(editor, presenter) {
    var setSlideContent = function () {
      presenter.content(editor.content());
    };

    $(editor).bind('input', setSlideContent);
  }

  loadDependencies();
});
