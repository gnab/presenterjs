define(['common', 'element', 'panel', 'presenter', 'presentation'], 
  function (common, Element, Panel, Presenter, Presentation) {

  var panel, splitter, presenter;

  function loadEnvironment() {
    var presentation = new Presentation();

    panel = new Panel('panel', presentation);
    splitter = new Element('#splitter');
    presenter = new Presenter('#presenter', presentation);

    loadLayout();
    loadSplitter();
  }

  function loadSplitter() {
    var resizing, offset;

    splitter.bind('mousedown', function (e) {
      offset = e.offsetX;
      resizing = true;
      splitter.addClass('resizing');
      $(document.body).css({cursor: 'w-resize'});
      return false;
    });

    $(document).bind('mousemove', function (e) {
      if (resizing) {
        resize(e.clientX - offset);
        return false;
      }
    });

    $(document).bind('mouseup', function (e) {
      if (resizing) {
        resizing = false;
        splitter.removeClass('resizing');
        $(document.body).css({cursor: 'inherit'});
      }
    });
  }

  function loadLayout() {
    var container = $(window);

    container.resize(function (e) {
      resize(panel.innerWidth());
    });

    resize(Math.floor(container.width() * 0.33));
  }

  function resize(panelWidth) {
    var container = $(window);

    if (panelWidth < container.width() * 0.2) {
      panelWidth = Math.floor(container.width() * 0.2);
    }
    else if (panelWidth > container.width() * 0.8) {
      panelWidth = Math.floor(container.width() * 0.8);
    }

    panel.resize(0, 0, panelWidth, container.height());

    splitter.resizeElement(panel.width(), 0, undefined, 
      container.width());

    presenter.resize(panel.width(), 0, container.width() - panel.width(), 
      container.height());
  }

  loadEnvironment();

});
