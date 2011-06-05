!function(context) {
  var util = context.presenter.util = {}
    , widthFactor = 4
    , heightFactor = 3
    ;

  util.resizeSlide = function (element) {
    var frameElement = element.find('.frame')
      , slideElement = element.find('.slide')
      , scaleSlide = createScaler(slideElement)
      ;

    element.height(element.width() * heightFactor / widthFactor);

    var dimensions = calculateSlideDimensions(element.width(), element.height()); 

    resizeElement(slideElement, dimensions.left, dimensions.top,
      dimensions.width, dimensions.height);

    resizeElement(frameElement, dimensions.left - 1, dimensions.top - 1,
      Math.ceil(dimensions.width * dimensions.scale) + 2,
      Math.ceil(dimensions.height * dimensions.scale) + 2);

    scaleSlide(dimensions.scale);
  };

  function createScaler (element) {
    var scaler;

    if (propertySupported(element, 'WebkitTransform')) {
      scaler = createScalerForEngine(element, 'webkit');
    }
    else if (propertySupported(element, 'MozTransform')) {
      scaler = createScalerForEngine(element, 'moz');
    }
    else if (propertySupported(element, 'OTransform')) {
      scaler = createScalerForEngine(element, 'o');
    }
    else if (propertySupported(element, 'transform')) {
      scaler = createScalerForEngine(element);
    }
    else if (propertySupported(element, 'zoom')) {
      scaler = function (scale) {
        element.css({'zoom': scale});
      }
    }

    return scaler;
  }

  function calculateSlideDimensions (containerWidth, containerHeight) {
    var slideWidth, slideHeight, slideLeft, slideTop, zoomFactor, 
        gutterSize = 20;

    if (containerWidth / widthFactor > containerHeight / heightFactor) {
      slideHeight = containerHeight;
      slideWidth = slideHeight / heightFactor * widthFactor;
    } else {
      slideWidth = containerWidth;
      slideHeight = slideWidth / widthFactor * heightFactor;
    }

    zoomFactor = slideHeight / 6;

    gutterSize = Math.max(gutterSize, gutterSize * zoomFactor / 100);

    slideWidth -= gutterSize * 2;
    slideHeight -= gutterSize * 2;

    zoomFactor = slideHeight / 6;

    slideLeft = (containerWidth - slideWidth) / 2;
    slideTop = (containerHeight - slideHeight) / 2;
    slideWidth = Math.floor(slideWidth * 100 / zoomFactor);
    slideHeight = Math.floor(slideHeight * 100 / zoomFactor);

    return {
      left: slideLeft,
      top: slideTop,
      width: slideWidth,
      height: slideHeight,
      scale: zoomFactor / 100,
    };
  }

  function resizeElement (element, left, top, width, height) {
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

  function propertySupported (element, property) {
    return element[0].style[property] !== undefined;
  }

  function formatEngineString (engine) {
    if (engine !== undefined) {
      return '-' + engine + '-';
    }
    else {
      return '';
    }
  }

  function createScalerForEngine (element, engine) {
    var style = {}, scaler;

    engineStr = formatEngineString(engine);

    scaler = function (scale) {
      var style = {};
      style[engineStr + 'transform'] = 
        'scale(' + scale + ')';
      element.css(style);
    };

    style[engineStr + 'transform-origin'] = '0 0';
    element.css(style);

    return scaler;
  }
}(this);
