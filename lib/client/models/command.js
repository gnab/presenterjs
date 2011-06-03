!function(context) {
  var models = context.presenter.models;  

  models.Command = Command;

  function Command(name, hideLabel) {
    this._name = name;
    this._hideLabel = hideLabel;
    this.command = function () {

    };
  }

  Command.prototype.name = function () {
    if (this._hideLabel) {
      return '';
    }

    return this._name;
  }

  Command.prototype.cssClass = function () {
    var cssClass = this._name.toLowerCase().replace(' ', '-');

    if (this._hideLabel) {
      cssClass = cssClass + ' no-text';
    }

    return cssClass;
  }
}(this);
