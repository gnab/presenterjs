define(['common', 'panel', 'list', 'editor', 'presenter'], 
  function (common, panel, list, editor, presenterFactory) {

  var container, presenter;

  function loadEnvironment() {
    container = $(window);

    presenter = presenterFactory.create('presenter');

    panel.add('list', 'List slides', list);
    panel.add('edit', 'Edit slide', editor);

    loadLayout();
    loadEditor();
    loadRoutes();
  }

  function loadLayout() {
    var updateLayout = function () {
      var panelWidth = Math.floor(container.width() * 0.33);

      panel.resize(0, 0, panelWidth, container.height());

      presenter.resize(
        panel.width(), 0, container.width() - panel.width(),
        container.height());
    }
    container.resize(updateLayout);
    updateLayout();
  }

  function loadEditor() {
    var setSlideContent = function () {
      presenter.content(editor.content());
    };

    $(editor).bind('input', setSlideContent);
  }

  function loadRoutes() {
    var app = $.sammy(function () {
      this.get('', function () {
        this.redirect('#/list');
      });
      this.get('#/list', function () {
        panel.tab('list');
      });
      this.get('#/edit', function () {
        panel.tab('edit');
      });
    });

    $(function () {
      app.run();
    });
  }

  loadEnvironment();
});
