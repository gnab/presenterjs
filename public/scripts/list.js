define(['element', 'presenter'], function (Element, Presenter) {

  List.inherit(Element);

  function List(id) {
    var self = this;

    Element.call(this, '#' + id);

    this._toolbarElement = new Element(this.children('.toolbar'));
    this._entriesElement = new Element(this.children('.entries'));
    this._entries = [];

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
    var key, toolbarHeight = this._toolbarElement.height();

    this.resizeElement(left, top, width, height);
    this._entriesElement.resizeElement(undefined, undefined,
      width, height - toolbarHeight);

    this.resizeEntries();
  };

  List.prototype.resizeEntries = function () {
    var width = this._entriesElement.innerWidth();

    for (key in this._entries) {
      if (this._entries.hasOwnProperty(key)) {
        this._entries[key].presenter.resize(undefined, undefined, width, 
          undefined); 
      }
    }
  }
  
  List.prototype.addSlide = function(slide) {
    var self = this, presenter = new Presenter('<div />', slide);

    this._entries.push({ slide: slide, presenter: presenter });
    this._entriesElement.append(presenter);

    presenter.content(slide.content());
    presenter.resize(undefined, undefined, 
      this._entriesElement.innerWidth(), undefined);

    this.resizeEntries();

    presenter.bind('click', function () {
      self.trigger('slideChanged', slide);
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

    this.resizeEntries();

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
