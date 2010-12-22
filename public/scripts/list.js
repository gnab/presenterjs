define(['element', 'presenter'], function (Element, Presenter) {

  List.inherit(Element);

  function List(id, presentation) {
    var self = this;

    Element.call(this, '#' + id);

    this._toolbarElement = new Element(this.children('.toolbar'));
    this._entriesElement = new Element(this.children('.entries'));
    this._entries = [];
    this._presentation = presentation;

    this._toolbarElement.children('.add').bind('click', function () {
      presentation.addSlide('empty slide');
    });

    this._toolbarElement.children('.remove').bind('click', function () {
      var slide = presentation.getCurrentSlide();
      if (slide) {
        presentation.removeSlide(slide);
      }
    });

    presentation.bind('slideAdded', function (e, slide) {
      self.addSlide(slide);
    });

    presentation.bind('slideChanged', function (e, index, slide) {
      self.gotoSlideByIndex(index);
    });

    presentation.bind('slideRemoved', function (e, index, slide) {
      self.removeSlideByIndex(index);
    });

    this.bind('focus', function () {
      if (self._currentScrollTop) {
        self._entriesElement.scrollTop(self._currentScrollTop);
      }
    });

    this.bind('blur', function () {
      self._currentScrollTop = self._entriesElement.scrollTop();
    });
  }

  List.prototype.resize = function (left, top, width, height) {
    var i, innerWidth = this._entriesElement.innerWidth();

    this.resizeElement(left, top, width, height);
    this._entriesElement.resizeElement(undefined, undefined,
      width, height - this._toolbarElement.height());

    for (i = 0; i < this._entries.length; i++) {
      this._entries[i].presenter.resize(undefined, undefined, innerWidth, 
        undefined); 
    }
  };

  List.prototype.addSlide = function(slide) {
    var self = this, presenter = new Presenter('<div />', slide);

    this._entries.push({ slide: slide, presenter: presenter });
    this._entriesElement.append(presenter);

    presenter.content(slide.content());
    presenter.resize(undefined, undefined, 
      this._entriesElement.innerWidth(), undefined);

    presenter.bind('click', function () {
      self._presentation.gotoSlide(slide);
    });

    presenter.bind('dblclick', function () {
      self.trigger('slideOpened', slide);
    });

    presenter.bind('selectstart', function () { return false; });
    presenter.bind('mousedown', function () { return false; });
  };
      
  List.prototype.removeSlideByIndex = function (index) {
    var entry = this._entries[index];
    
    if (entry === this._currentEntry) {
      this._currentEntry = undefined;
    }

    entry.presenter.remove();
    delete entry;

    this._entries.splice(index, 1);
  };

  List.prototype.gotoSlideByIndex = function (index) {
    var scrollTop, slideHeigt, slideTop, slideBottom;

    if (this._currentEntry) {
      this._currentEntry.presenter.removeClass('active');
    }
    this._currentEntry = this._entries[index];
    this._currentEntry.presenter.addClass('active');

    scrollTop = this._entriesElement.scrollTop();
    slideHeight = this._currentEntry.presenter.height();
    slideTop = slideHeight * index;
    slideBottom = slideTop + slideHeight;

    if (slideTop < scrollTop) {
      this._entriesElement.scrollTop(slideTop);
    }
    else if (slideBottom > scrollTop + this.height()) {
      this._entriesElement.scrollTop(slideBottom - 
        this._entriesElement.height());
    }
  };

  return List;

});
