define(['common', 'panel', 'list', 'editor', 'presenter'], 
  function (common, panel, list, editor, presenterFactory) {

  var container, presenter;

  function loadEnvironment() {
    container = $(window);

    presenter = presenterFactory.create($('#presenter'));

    panel.add('list', 'List slides', list);
    panel.add('edit', 'Edit slide', editor);

    list.add({content: 'empty slide'});
    list.add({content: 'empty slide'});
    list.add({content: 'empty slide'});
    list.add({content: 'empty slide'});
    list.add({content: 'empty slide'});

    $(document).keydown(function (e) {
      if (panel.tab() !== 'list') {
        return;
      }

      if (e.keyCode === 38) {
        list.movePrevious();
      }
      else if (e.keyCode === 40) {
        list.moveNext();
      }
    });

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
      this.get('#/show/:slide', function () {
        panel.tab('list');
        list.slide(this.params['slide']);
      });
      this.get('#/edit', function () {
        panel.tab('edit');
      });
      this.get('#/edit/:slide', function () {
        panel.tab('edit');
        list.slide(this.params['slide']);
      });
    });

    $(function () {
      app.run();
    });
  }

  loadEnvironment();
});
