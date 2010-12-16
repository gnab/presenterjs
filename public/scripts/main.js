define(['common', 'panel', 'presenter', 'presentation'], 
  function (common, Panel, Presenter, Presentation) {

  var container, panel, presenter, presentation, router;

  function loadEnvironment() {
    container = $(window);
    presentation = new Presentation();
    presenter = new Presenter('#presenter', presentation);
    panel = new Panel('panel', presentation);

    loadLayout();
    loadKeybordEvents();
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
      if (panel.gotoTab() === 'list') {
        if (e.keyCode === 38) {
          presentation.movePrevious();
        }
        else if (e.keyCode === 40) {
          presentation.moveNext();
        }
        else if (e.keyCode === 46) {
          var slide = presentation.getCurrentSlide();
          if (slide) {
            presentation.removeSlide(slide);
          }
        }
      }
      else if (panel.gotoTab() === 'edit') {
        if (e.keyCode === 27) {
          panel.gotoTab('list');
        }
      }
    });
    $(document).keyup(function (e) {
      if (panel.gotoTab() === 'list') {
        if (e.keyCode === 13) {
          if (presentation.getCurrentSlide()) {
            panel.gotoTab('edit');
          }
        }
      }
    });
  }

  loadEnvironment();

});
