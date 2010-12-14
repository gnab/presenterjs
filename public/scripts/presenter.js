define(['element', 'common'], function (Element, common) {

  Presenter.inherit(Element);

  function Presenter(element) {
    Element.call(this, element);

    this._slide = createSlide(this._element);

    this.addClass('presenter');
  }

  Presenter.prototype.resize = function (left, top, width, height) {
    this.resizeElement(left, top, width, height);
    this._slide.resize(width, height);
  };

  Presenter.prototype.content = function (content) {
    if (content !== undefined) {
      this._slide.content(content);
    }
    return this._slide.content();
  };

  function createSlide(presenterElement) {
    var slideElement = $('<div />'),
        contentElement = $('<div />'),
        frameElement = $('<div />'),
        scaleSlide = createScaler(slideElement),
        setContent = createContentAssigner(contentElement),
        slideContent = '';

    slideElement.addClass('slide');

    frameElement.addClass('frame');
    presenterElement.append(frameElement);

    contentElement.css({ padding: '2em' });

    slideElement.append(contentElement);
    presenterElement.append(slideElement);

    return {
      resize: function (width, height) {
        resizeSlide(slideElement, frameElement, width, height, scaleSlide);
      },
      content: function (content) {
        if (content !== undefined) {
          slideContent = content;
          setContent(content);
        }
        return slideContent;
      }
    };
  }

  function createScaler(element) {
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

  function propertySupported(element, property) {
    return element[0].style[property] !== undefined;
  }

  function formatEngineString(engine) {
    if (engine !== undefined) {
      return '-' + engine + '-';
    }
    else {
      return '';
    }
  }

  function createScalerForEngine(element, engine) {
    var style = {}, scaler;

    engine = formatEngineString(engine);

    scaler = function (scale) {
      var style = {};
      style[engine + 'transform'] = 
        'scale(' + scale + ')';
      element.css(style);
    };

    style[engine + 'transform-origin'] = '0 0';
    element.css(style);

    return scaler;
  }

  function createContentAssigner(contentElement) {
    var converter = new Showdown.converter();

    return function (content) {
      var html = converter.makeHtml(content),
          sanitizedHtml = sanitizeHtml(html);

      contentElement.html(sanitizedHtml);

      contentElement.find('code').each(function(i, e) {
        hljs.highlightBlock(e, '  ');
      });
    }
  }

  function sanitizeHtml(html) {
    return html_sanitize(html, filterUrl, filterNameIdClass);
  }

  function filterUrl(url) { 
    if (/^https?:\/\//.test(url)) {
      return url;
    }
  }

  function filterNameIdClass(id) { 
    return id; 
  }

  function resizeSlide(element, shadow, width, height, scaleSlide) {
    var dimensions = calculateSlideDimensions(width, height); 

    common.resizeElement(element, dimensions.left, dimensions.top,
      dimensions.width, dimensions.height);

    common.resizeElement(shadow, dimensions.left - 1, dimensions.top - 1,
      Math.ceil(dimensions.width * dimensions.scale) + 2,
      Math.ceil(dimensions.height * dimensions.scale) + 2);

    scaleSlide(dimensions.scale);
  }

  function calculateSlideDimensions(containerWidth, containerHeight) {
    var slideWidth, slideHeight, slideLeft, slideTop, zoomFactor
        widthFactor = 4, heightFactor = 3, gutterSize = 20;

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
    }
  }

  return Presenter;

});
