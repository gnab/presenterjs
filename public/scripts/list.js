define(['element', 'presenter'], function (Element, Presenter) {

  List.inherit(Element);

  function List(id, presentation) {
    var self = this;

    Element.call(this, '#' + id);

    this._toolbarElement = new Element(this.children('.toolbar'));
    this._entriesElement = new Element(this.children('.entries'));
    this._entries = [];
    this._presentation = presentation;

    loadToolbarCommands(this);

    presentation.bind('slideAdded', function (e, slide) {
      self.addSlide(slide);
    });

    presentation.bind('slideChanged', function (e, index, slide) {
      if (slide) {
        self.gotoSlideByIndex(index);
      }
    });

    presentation.bind('slideMoved', function (e, index, newIndex, slide) {
      var entry = self._entries[index];

      self._entries.splice(index, 1);
      entry.presenter.detach();

      self._entries.splice(newIndex, 0, entry);
      if (newIndex > index) {
        self._entries[newIndex - 1].presenter.after(entry.presenter);
      }
      else {
        self._entries[newIndex + 1].presenter.before(entry.presenter);
      }

      if (self._currentEntry.slide === slide) {
        scrollEntryIntoView(self, self._currentEntry); 
      }
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

  function loadToolbarCommands(self) {
    self._toolbarElement.children('.add').bind('click', function (e) {
      self._presentation.addSlide();
    });

    self._toolbarElement.children('.remove').bind('click', function () {
      var slide = self._presentation.getCurrentSlide();
      if (slide) {
        self._presentation.removeSlide(slide);
      }
    });

    self._toolbarElement.children('.up').bind('click', function () {
      var slide = self._presentation.getCurrentSlide();
      if (slide) {
        self._presentation.moveSlideUp(slide);
      }
    });

    self._toolbarElement.children('.down').bind('click', function () {
      var slide = self._presentation.getCurrentSlide();
      if (slide) {
        self._presentation.moveSlideDown(slide);
      }
    });

    self._presentation.bind('slideChanged', function (e, index, slide) {
      if (slide) {
        self._toolbarElement.children('.remove,.up,.down').
          removeClass('disabled');
      }
      else {
        self._toolbarElement.children('.remove,.up,.down').
          addClass('disabled');
      }
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
    if (this._currentEntry) {
      this._currentEntry.presenter.removeClass('active');
    }
    this._currentEntry = this._entries[index];
    this._currentEntry.presenter.addClass('active');

    scrollEntryIntoView(this, this._currentEntry);
  };

  function scrollEntryIntoView(self, entry) {
    var scrollTop, entryHeigt, entryTop, entryBottom, listHeight;

    scrollTop = self._entriesElement.scrollTop();
    entryHeight = entry.presenter.height();
    entryTop = entry.presenter.top();
    entryBottom = scrollTop + entryTop + entryHeight;
    listHeight = self._entriesElement.height();

    if (entryTop < 0) {
      self._entriesElement.scrollTop(scrollTop + entryTop);
    }
    else if (entryBottom > scrollTop + listHeight) {
      self._entriesElement.scrollTop(entryBottom - listHeight);
    }
  }

  return List;

});
