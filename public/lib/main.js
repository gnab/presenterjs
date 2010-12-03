define(function () {

  var container, sidebar, editor, presenter;

  function loadDependencies() {
    require([
      'presenter',
      'vendor/jquery-1.4.4.min'],
      function (presenterFactory) {
        presenterFactory.create('presenter', function (instance) {
          presenter = instance;
          updateLayout(); 
        });
      }
    );

    require.ready(function () {
      loadEnvironment();
    });
  }

  function loadEnvironment() {
    bindToElements();

    loadLayout();
    loadEditor();
  }

  function bindToElements() {
    container = $(window);

    sidebar = $('#sidebar');
    editor = $('#editor');
  }

  function loadLayout() {
    container.resize(updateLayout);
  }

  function updateLayout() {
    resizeSidebar();

    presenter.resize(
      sidebar.outerWidth(), 
      0, 
      container.width() - sidebar.outerWidth(),
      container.height()
    );
  }

  function resizeSidebar() {
    var width = Math.floor(container.width() * 0.33);

    sidebar.css({
      width: width + 'px'
    });

    resizeEditor(width, container.height());
  }

  function resizeEditor(width, height) {
    var margin = 10;

    width -= margin * 2;
    height -= margin * 2;

    editor.css({
      width: width + 'px',
      height: height + 'px',
      left: margin + 'px',
      top: margin + 'px'
    });
  }

  function loadEditor() {
    var setSlideContent = function () {
      presenter.content(editor.val());
    };

    editor.bind("keyup", setSlideContent);
    editor.bind("paste", setSlideContent);
  }

  loadDependencies();
});
