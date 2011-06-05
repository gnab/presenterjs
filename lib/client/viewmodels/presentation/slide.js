!function (context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Slide = Slide;

  function Slide (content) {
    this.content = ko.observable(content);
  }

}(this);
