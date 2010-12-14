define(['element', 'presenter'], function (Element, Presenter) {

  List.inherit(Element);

  function List(id, presentation) {
    var self = this;

    Element.call(this, '#' + id);
    this._presentation = presentation;
    this._entries = [];

    presentation.bind('addSlide', function (e, slide) {
      self.add(slide);
    });

    presentation.bind('gotoSlide', function (e, slide) {
      self.gotoSlide(slide);
    });
  }

  List.prototype.resize = function (left, top, width, height) {
    var key;

    this.resizeElement(left, top, width, height);

    for (key in this._entries) {
      if (this._entries.hasOwnProperty(key)) {
        this._entries[key].presenter.resize(undefined, undefined, width, 
          250); 
      }
    }
  };
  
  List.prototype.add = function(slide) {
    var self = this, presenter = new Presenter('<div />');

    this._entries.push({ slide: slide, presenter: presenter });
    this.append(presenter);

    presenter.content(slide.content());
    presenter.resize(undefined, undefined, this.width(), 250);

    presenter.bind('click', function () {
      self._presentation.gotoSlide(slide);
    });

    slide.bind('content', function () {
      presenter.content(slide.content());
    });
  };
      
  List.prototype.gotoSlideByIndex = function (index) {
    var slideHeigt, slideTop, slideBottom;

    if (index >= 0 && index < this._entries.length) {
      if (this._currentSlide) {
        this._currentSlide.presenter.removeClass('active');
      }
      this._currentSlide = this._entries[index];
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

  List.prototype.gotoSlide = function (slide) {
    var i;

    for (i = 0; i < this._entries.length; i++) {
      if (this._entries[i].slide === slide) {
        this.gotoSlideByIndex(i);
      }
    }
  };

  List.prototype.movePrevious = function () {
    if (!this._currentSlide && this._entries.length > 0) {
      this.gotoSlideByIndex(0);
    }
    else if (this._currentSlideIndex > 0) {
      this.gotoSlideByIndex(this._currentSlideIndex - 1);
    } 
  };
     
  List.prototype.moveNext = function () {
    if (!this._currentSlide && this._entries.length > 0) {
      this.gotoSlideByIndex(0);
    }
    else if (this._currentSlideIndex < this._entries.length - 1) {
      this.gotoSlideByIndex(this._currentSlideIndex + 1);
    } 
  };

  return List;

});
