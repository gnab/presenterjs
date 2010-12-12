define(['element', 'presenter'], function (Element, Presenter) {

  List.inherit(Element);

  function List(id, presentation) {
    var self = this;

    Element.call(this, '#' + id);
    this._presentation = presentation;
    this._slides = [];

    presentation.bind('addSlide', function (e, slide) {
      self.add(slide.content());
    });
  }

  List.prototype.resize = function (left, top, width, height) {
    var key;

    this.resizeElement(left, top, width, height);

    for (key in this._slides) {
      if (this._slides.hasOwnProperty(key)) {
        this._slides[key].presenter.resize(undefined, undefined, width, 
          250); 
      }
    }
  };
  
  List.prototype.add = function(slide) {
    var presenter = new Presenter('<div />');

    this._slides.push({ slide: slide, presenter: presenter });
    this.append(presenter);
    presenter.resize(undefined, undefined, this.width(), 250);
  };
      
  List.prototype.slide = function (index) {
    var slideHeigt, slideTop, slideBottom;

    if (index >= 0 && index < this._slides.length) {
      if (this._currentSlide) {
        this._currentSlide.presenter.removeClass('active');
      }
      this._currentSlide = this._slides[index];
      this._currentSlide.presenter.addClass('active');
      this._currentSlideIndex = index;

      slideHeight = this._currentSlide.presenter.height();
      slideTop = slideHeight * this._currentSlideIndex;
      slideBottom = slideTop + slideHeight;

      if (slideTop < this._element.scrollTop() ||
          slideBottom > this._element.height()+this._element.scrollTop()) {
        this._element.scrollTop(slideTop);
      }
    }
  };

  List.prototype.movePrevious = function () {
    if (!this._currentSlide && this._slides.length > 0) {
      this.slide(0);
    }
    else if (this._currentSlideIndex > 0) {
      this.slide(this._currentSlideIndex - 1);
    } 
  };
     
  List.prototype.moveNext = function () {
    if (!this._currentSlide && this._slides.length > 0) {
      this.slide(0);
    }
    else if (this._currentSlideIndex < this._slides.length - 1) {
      this.slide(this._currentSlideIndex + 1);
    } 
  };

  return List;

});
