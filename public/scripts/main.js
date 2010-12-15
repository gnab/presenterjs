define(['panel', 'list', 'editor', 'presenter', 'presentation'], 
  function (Panel, List, Editor, Presenter, Presentation) {

  var container, panel, list, editor, presenter, presentation, router;

  function loadEnvironment() {
    container = $(window);
    presentation = new Presentation();

    loadPresenter();
    loadPanel();
    loadLayout();
    loadKeybordEvents();

    loadRouter();
  }

  function loadPresenter() {
    var currentSlide, setContent;

    presenter = new Presenter('#presenter');

    setContent = function (e, content) {
      presenter.content(content);
    };

    presentation.bind('slideChanged', function (e, index, slide) {
      if (currentSlide) {
        currentSlide.unbind('contentChanged', setContent);
      }
      setContent(undefined, slide.content());
      slide.bind('contentChanged', setContent);
      currentSlide = slide;
    });
  }

  function loadPanel() {
    list = new List('list'),
    editor = new Editor('editor');

    panel = new Panel('panel');
    panel.addTab('list', 'List slides', list);
    panel.addTab('edit', 'Edit slide', editor);

    list.bind('slideChanged', function (e, slide) {
      presentation.gotoSlide(slide);
    });

    list.bind('slideOpened', function (e, slide) {
      router.setLocation('#/edit');  
    });

    presentation.bind('slideAdded', function (e, slide) {
      list.addSlide(slide);
    });

    presentation.bind('slideChanged', function (e, index, slide) {
      list.gotoSlideByIndex(index);
      editor.content(slide.content());
    });
 
    editor.bind('input', function () {
      var slide = presentation.getCurrentSlide();
      if (slide) {
        slide.content(editor.content());
      }
    });
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

  function loadKeybordEvents() {
    $(document).keydown(function (e) {
      if (panel.tab() !== 'list') {
        return;
      }

      if (e.keyCode === 38) {
        presentation.movePrevious();
      }
      else if (e.keyCode === 40) {
        presentation.moveNext();
      }
    });
  }

  function loadRouter() {
    router = $.sammy(function () {
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
        presentation.addSlide('empty slide');
        this.redirect('#/list');
      });
    });

    $(function () {
      router.run();
    });
  }

  loadEnvironment();

});
