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
    after: function (element) {
      this._element.after(element._element || element);
    },
    before: function (element) {
      this._element.before(element._element || element);
    },
    remove: function () {
      this._element.remove();
    },
    detach: function () {
      this._element.detach();
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
    innerWidth: function () {
      return this._element[0].clientWidth;
    },
    innerHeight: function () {
      return this._element[0].clientHeight;
    },
    width: function () {
      return this._element.outerWidth();
    },
    height: function () {
      return this._element.outerHeight();
    },
    top : function () {
      return this._element.position().top;
    },
    selectionStart: function (pos) {
      if (pos !== undefined) {
        this._element[0].selectionStart = pos;
      }
      return this._element[0].selectionStart;
    },
    selectionEnd: function (pos) {
      if (pos !== undefined) {
        this._element[0].selectionEnd = pos;
      }
      return this._element[0].selectionEnd;
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
