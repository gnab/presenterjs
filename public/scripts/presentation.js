define(['model', 'slide'], function (Model, Slide) {

  Presentation.inherit(Model);

  function Presentation(title) {
    this.title(title);
    this._slides = [];
  }

  Presentation.prototype.title = Model.createProperty('title');

  Presentation.prototype.addSlide = function (content) {
    var slide = new Slide(content);
    this._slides.push(slide);
    this.trigger('addSlide', slide);
  };

  Presentation.prototype.getSlideCount = function () {
    return this._slides.length;
  };

  return Presentation;

});
