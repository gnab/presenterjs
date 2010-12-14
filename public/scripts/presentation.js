define(['model', 'slide'], function (Model, Slide) {

  Presentation.inherit(Model);

  function Presentation(title) {
    this.title(title);
    this._currentSlide = undefined;
    this._slides = [];
  }

  Presentation.prototype.title = Model.createProperty('title');

  Presentation.prototype.addSlide = function (content) {
    var slide = new Slide(content);
    this._slides.push(slide);
    this.trigger('addSlide', slide);
  };

  Presentation.prototype.gotoSlide = function (slide) {
    if (slide) {
      this._currentSlide = slide;
      this.trigger('gotoSlide', slide);
    }
  };

  Presentation.prototype.getCurrentSlide = function () {
    return this._currentSlide;
  };

  return Presentation;

});
