!function (context) {
  var viewmodels = context.presenter.viewmodels
    , Slide = viewmodels.Slide;

  viewmodels.Presentation = Presentation;

  function Presentation (name, content) {
    this.name = name;
    this.slides = ko.observableArray([
      new Slide(content)
    ]);

    this.save = function () {
      var content = this.slides().map(function (slide) {
        return slide.content();
      }).join('\r\n\r\n');
      $.post('/edit/presenterjs/' + this.name, 'file=' + content, function (data) { });
    };

    $(document).bind('save', this.save.bind(this));
  }

}(this);
