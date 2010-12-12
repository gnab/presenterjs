define(['panel', 'list', 'editor', 'presenter', 'presentation'], 
  function (Panel, List, Editor, Presenter, Presentation) {

  var container, panel, list, presenter, presentation;

  function loadEnvironment() {
    container = $(window);

    presentation = new Presentation();

    presenter = new Presenter('#presenter');

    loadPanel(presentation);
    loadLayout();
    loadRoutes();
  }

  function loadPanel(presentation) {
    var editor = new Editor('editor');

    list = new List('list', presentation),
        
    panel = new Panel('panel');
    panel.addTab('list', 'List slides', list);
    panel.addTab('edit', 'Edit slide', editor);

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

    var setSlideContent = function () {
      presenter.content(editor.content());
    };

    editor.bind('input', setSlideContent);
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
      this.get('#/add', function () {
        presentation.addSlide('');
        this.redirect('#/list');
      });
    });

    $(function () {
      app.run();
    });
  }

  loadEnvironment();

});
