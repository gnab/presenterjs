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
    this.trigger('slideAdded', slide);
    if (!this._currentSlide) {
      this.gotoSlide(slide);
    }
  };

  Presentation.prototype.gotoSlide = function (slide) {
    this._currentSlide = slide;
    this._currentSlideIndex = this._slides.indexOf(slide);
    this.trigger('slideChanged', [this._currentSlideIndex, slide]);
  };

  Presentation.prototype.movePrevious = function () {
    if (!this._currentSlide && this._slides.length > 0) {
      this.gotoSlide(this._slides[0]);
    }
    else if (this._currentSlideIndex > 0) {
      this.gotoSlide(this._slides[this._currentSlideIndex - 1]);
    } 
  };
     
  Presentation.prototype.moveNext = function () {
    if (!this._currentSlide && this._slides.length > 0) {
      this.gotoSlide(this._slides[0]);
    }
    else if (this._currentSlideIndex < this._slides.length - 1) {
      this.gotoSlide(this._slides[this._currentSlideIndex + 1]);
    } 
  };

  Presentation.prototype.getCurrentSlide = function () {
    return this._currentSlide;
  };

  return Presentation;

});
