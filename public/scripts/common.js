define(function () {

  return {
    resizeElement: function (element, left, top, width, height) {
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

      element.css(style);
    }
  }
});
