define(['common', 'panel', 'presenter', 'presentation'], 
  function (common, Panel, Presenter, Presentation) {

  function loadEnvironment() {
    var presentation = new Presentation(),
        presenter = new Presenter('#presenter', presentation),
        panel = new Panel('panel', presentation);

    loadLayout(presenter, panel);
  }

  function loadLayout(presenter, panel) {
    var container = $(window);

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

  loadEnvironment();

});
