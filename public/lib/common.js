define({
  resizeElement: function (element, left, top, width, height) {
    element.css({
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px',
    });
  }
});
