define(['common'], function (common) {

  function wrapPanel() {
    var panelElement = $('#panel'),
        headerElement = panelElement.children('#header'),
        tabsElement = panelElement.find('ul'),
        tabs = {},
        currentTab;

    panel = {
      resize: function (left, top, width, height) {
        common.resizeElement(panelElement, left, top, width, height);
        resizeTabbedElements(tabs, width, 
          height - headerElement.outerHeight());
      },
      width: function () {
        return panelElement.outerWidth();
      },
      add: function (id, title, element) {
        var tab = $('<li></li>'),
            tabContent = $('<a href="#/' + id + '">' + title + '</a>');

        tab.append(tabContent);
        tabsElement.append(tab);

        tabs[id] = {id: id, title: title, header: tabContent, 
          content: element};
        element.hide();
      },
      tab: function (id) {
        if (id) {
          var switchToTab = tabs[id];
          if (switchToTab) {
            if (currentTab) {
              currentTab.header.removeClass('active');
              currentTab.content.hide();
            }
            currentTab = switchToTab;
            currentTab.header.addClass('active');
            currentTab.content.show();
          }
        }
        return currentTab && currentTab.id;
      }
    };

    return panel;
  }

  function resizeTabbedElements(tabs, width, height) {
    var key, element;

    for (key in tabs) {
      if (tabs.hasOwnProperty(key)) {
        tabs[key].content.resize(undefined, undefined, width, height); 
      }
    }
  }

  return wrapPanel();
});
