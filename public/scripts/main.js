define(['common', 'element', 'panel', 'presenter', 'presentation'], 
  function (common, Element, Panel, Presenter, Presentation) {

  var panel, splitter, presenter;

  $(document).ready(function () {
    loadEnvironment();
  });

  function loadEnvironment() {
    var presentation = new Presentation();

    panel = new Panel('panel', presentation);
    splitter = new Element('#splitter');
    presenter = new Presenter('#presenter', presentation);

    loadLayout();
    loadSplitter();
    loadKeybordEvents();
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

    resize(Math.floor(container.width() * 0.275));
  }

  function resize(panelWidth) {
    var container = $(window);

    if (panelWidth < container.width() * 0.275) {
      panelWidth = Math.floor(container.width() * 0.275);
    }
    else if (panelWidth > container.width() * 0.725) {
      panelWidth = Math.floor(container.width() * 0.725);
    }

    panel.resize(0, 0, panelWidth, container.height());

    panelWidth = panel.isVisible() ? panel.width() : 0;

    splitter.resizeElement(panelWidth, 0, undefined, 
      container.height());

    presenter.resize(panelWidth, 0, container.width() - panelWidth, 
      container.height());
  }

  function loadKeybordEvents() {
    $(document).keydown(function (e) {
      if (e.keyCode === 122) {
        if (e.shiftKey) {
          panel.toggle();
          splitter.toggle();

          resize(panel.innerWidth());
        }
      }
    });
  }

});
