!function (context) {
  var viewmodels = context.presenter.viewmodels
    , Slide = viewmodels.Slide;

  viewmodels.Presentation = Presentation;

  function Presentation (name, content) {
    this.name = name;
    this.selectedSlide = ko.observable();
    this.slides = ko.observableArray([
      new Slide(content)
    ]);

    var firstSlide = this.slides()[0];
    firstSlide.selected(true);
    this.selectedSlide(firstSlide);

    this.save = function () {
      var content = this.slides().map(function (slide) {
        return slide.content();
      }).join('\r\n\r\n');
      $.post('/edit/presenterjs/' + this.name, 'file=' + content, function (data) { });
    };

    $(document).bind('save', this.save.bind(this));
  }

}(this);
