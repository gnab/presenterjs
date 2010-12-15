define(function () {

  function Element(element) {
    this._element = $(element);
  }

  Element.prototype = {
    bind: function (event, handler) {
      this._element.bind(event, handler);
    },
    trigger: function (event, arg) {
      this._element.trigger(event, arg);
    },
    append: function (element) {
      this._element.append(element._element || element);
    },
    remove: function () {
      this._element.remove();
    },
    find: function (query) {
      return this._element.find(query);
    },
    children: function (query) {
      return this._element.children(query);
    },
    addClass: function (className) {
      this._element.addClass(className);
    },
    removeClass: function (className) {
      this._element.removeClass(className);
    },
    val: function (value) {
      if (value !== undefined) {
        return this._element.val(value);
      }
      return this._element.val();
    },
    scrollTop: function (value) {
      if (value !== undefined) {
        return this._element.scrollTop(value);
      }
      return this._element.scrollTop();
    },
    show: function () {
      this._element.show();
    },
    hide: function () {
      this._element.hide();
    },
    focus: function () {
      this._element.focus();
    },
    blur: function () {
      this._element.blur();
    },
    width: function () {
      return this._element.outerWidth();
    },
    height: function () {
      return this._element.outerHeight();
    },
    resizeElement: function (left, top, width, height) {
      var style = {};

      if (left !== undefined) {
        style['left'] = left + 'px'
      }
      if (top !== undefined) {
        style['top'] = top + 'px'
      }
      if (width !== undefined) {
        style['width'] = width + 'px'
      }
      if (height !== undefined) {
        style['height'] = height + 'px'
      }

      this._element.css(style);
    }
  };

  return Element;

});
