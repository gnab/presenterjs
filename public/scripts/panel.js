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

    list.bind('slideOpened', function (e, slide) {
      self.gotoTab('edit');
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
    var self = this, tab = $('<li></li>'),
        tabContent = $('<a href="#">' + title + '</a>');

    tab.append(tabContent);
    this._tabsElement.append(tab);

    this._tabs[id] = { 
      id: id, 
      title: title, 
      header: tabContent, 
      content: element
    };

    tabContent.bind('click', function () {
      self.gotoTab(id);
    });
  };

  Panel.prototype.gotoTab = function (id) {
    if (id) {
      var switchToTab = this._tabs[id];
      if (switchToTab) {
        if (this._currentTab) {
          this._currentTab.header.removeClass('active');
          this._currentTab.content.blur();
          this._currentTab.content.hide();
        }
        this._currentTab = switchToTab;
        this._currentTab.header.addClass('active');
        this._currentTab.content.show();
        this._currentTab.content.focus();
      }
    }
    return this._currentTab && this._currentTab.id;
  }

  return Panel;

});
