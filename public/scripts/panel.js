define(['element', 'list', 'editor'], function (Element, List, Editor) {

  Panel.inherit(Element);

  function Panel(id, presentation) {
    var self = this, list, editor;

    this._element = $('#' + id);
    this._headerElement = new Element(this.children('.header'));
    this._tabsElement = new Element(this.find('ul'));
    this._tabs = [];

    list = new List('list', presentation),
    editor = new Editor('editor', presentation);

    this.addTab('list', 'List slides', list);
    this.addTab('edit', 'Edit slide', editor);

    this.gotoTab('list');
    this.disableTab('edit');

    presentation.bind('slideChanged', function (e, index, slide) {
      if (slide) {
        self.enableTab('edit');
      }
      else {
        self.disableTab('edit');
      }
    });

    list.bind('slideOpened', function (e, slide) {
      self.gotoTab('edit');
    });

    this.loadKeybordEvents(presentation);
  }

  Panel.prototype.loadKeybordEvents = function (presentation) {
    var self = this, slide;

    $(document).keydown(function (e) {
      if (self._currentTab.id === 'list') {
        if (e.keyCode === 38) {
          if (e.shiftKey) {
            slide = presentation.getCurrentSlide();
            slide && presentation.moveSlideUp(slide);
          } else {
            presentation.movePrevious();
          }
        }
        else if (e.keyCode === 40) {
          if (e.shiftKey) {
            slide = presentation.getCurrentSlide();
            slide && presentation.moveSlideDown(slide);
          } else {
            presentation.moveNext();
          }
        }
        else if (e.keyCode === 45) {
          presentation.addSlide();
        }
        else if (e.keyCode === 46) {
          slide = presentation.getCurrentSlide();
          slide && presentation.removeSlide(slide);
        }
      }
      else if (self._currentTab.id === 'edit') {
        if (e.keyCode === 27) {
          self.gotoTab('list');
        }
      }
    });
    $(document).keyup(function (e) {
      if (self._currentTab.id === 'list') {
        if (e.keyCode === 13) {
          if (presentation.getCurrentSlide()) {
            self.gotoTab('edit');
          }
        }
      }
    });
  }

  Panel.prototype.resize = function (left, top, width, height) {
    var key, tabHeight = height - this._headerElement.height();

    this.resizeElement(left, top, width, height);

    for (key in this._tabs) {
      if (this._tabs.hasOwnProperty(key)) {
        this._tabs[key].content.resize(undefined, undefined, width, 
          tabHeight); 
      }
    }
  };

  Panel.prototype.addTab = function (id, title, element) {
    var self = this, tab = new Element('<li></li>'),
        tabContent = $('<a href="#">' + title + '</a>');

    tab.append(tabContent);
    this._tabsElement.append(tab);
    element.hide();

    this._tabs[id] = { 
      id: id, 
      title: title, 
      header: tabContent, 
      content: element
    };

    tabContent.bind('click', function () {
      if (!tabContent.hasClass('disabled')) {
        self.gotoTab(id);
      }
    });
  };

  Panel.prototype.enableTab = function (id) {
    var tab = this._tabs[id];

    if (tab) {
      tab.header.removeClass('disabled');
    }
  }

  Panel.prototype.disableTab = function (id) {
    var tab = this._tabs[id];

    if (tab) {
      tab.header.addClass('disabled');
    }
  }

  Panel.prototype.gotoTab = function (id) {
    var switchToTab, tabHeight;

    switchToTab = this._tabs[id];
    if (switchToTab) {
      if (this._currentTab) {
        this._currentTab.header.removeClass('active');
        this._currentTab.content.blur();
        this._currentTab.content.hide();
      }
      tabHeight = this.height() - this._headerElement.height();
      this._currentTab = switchToTab;
      this._currentTab.header.addClass('active');
      this._currentTab.content.show();
      this._currentTab.content.resize(undefined, undefined, 
        this.innerWidth(), tabHeight);
      this._currentTab.content.focus();
    }
  }

  return Panel;

});
