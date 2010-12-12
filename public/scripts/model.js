define(function () {

  function Model () {

  }

  Model.createProperty = function (key) {
    return function (value) {
      if (value !== undefined) {
        this['_' + key] = value;
        this.trigger(key, value);
      }
      return this['_' + key];
    }
  };

  Model.prototype = {
    bind: function(event, handler) {
      $(this).bind(event, handler);
    },
    trigger: function (event, args) {
      $(this).trigger(event, args);
    }
  };

  return Model;

});
