!function(context) {
  var models = context.presenter.models;  

  models.Command = Command;

  function Command(name, hideLabel, command) {
    this._name = name;
    this._hideLabel = hideLabel;
    this.command = command || function () {};
  }

  Command.prototype.name = function () {
    if (this._hideLabel) {
      return '';
    }

    return this._name;
  }

  Command.prototype.cssClass = function () {
    return this._name.toLowerCase().replace(' ', '-');
  }
}(this);
