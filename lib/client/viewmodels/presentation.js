(function (context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Presentation = Presentation;

  function Presentation (content) {
    this.slides = [content];
  }

})(this);
