(function() {
  var dependencies = [
    'presenter'
  ];

  function loadDependencies() {
    require(dependencies);

    require.ready(function () {
      loadEnvironment();
    });
  }

  function loadEnvironment() {
    loadLayout();
  }

  function loadLayout() {

  }

  loadDependencies();
})();
