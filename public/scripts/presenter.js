define(['common'], function (common) {

  function createPresenter(id) {
    var presenterElement = $('#' + id), 
        slide = createSlide(presenterElement);

    presenterElement.css({
      background: '#edece9',
      position: 'absolute'
    });

    return {
      resize: function (left, top, width, height) {
        common.resizeElement(presenterElement, left, top, width, height);
        slide.resize(width, height);
      },
      content: function (content) {
        if (content !== undefined) {
          slide.content(content);
        }
        return slide.content();
      }
    };
  }

  function createSlide(presenterElement) {
    var slideElement = $('<div />'),
        contentElement = $('<div />'),
        shadowElement = $('<div />'),
        scaleSlide = createScaler(slideElement),
        setContent = createContentAssigner(contentElement),
        content = '';

    styleShadow(shadowElement);
    presenterElement.append(shadowElement);

    slideElement.css({
      background: '#fff',
      border: '1px solid transparent',
      position: 'relative',
      overflow: 'hidden'
    });

    contentElement.css({ padding: '2em' });

    slideElement.append(contentElement);
    presenterElement.append(slideElement);

    return {
      resize: function (width, height) {
        resizeSlide(slideElement, shadowElement, width, height, scaleSlide);
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

    if (propertySupported('WebkitTransform')) {
      scaler = createScalerForEngine(element, 'webkit');
    }
    else if (propertySupported('MozTransform')) {
      scaler = createScalerForEngine(element, 'moz');
    }
    else if (propertySupported('OTransform')) {
      scaler = createScalerForEngine(element, 'o');
    }
    else if (propertySupported('transform')) {
      scaler = createScalerForEngine(element);
    }
    else if (propertySupported('zoom')) {
      scaler = function (scale) {
        element.css({'zoom': scale});
      }
    }

    return scaler;
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

  function styleShadow(shadow) {
    var style = {}, engine;

    if (propertySupported('WebkitBoxShadow')) {
      engine = 'webkit';
    }
    else if (propertySupported('MozBoxShadow')) {
      engine = 'moz'
    }
    else if (propertySupported('BoxShadow')) {
      engine = '';
    }

    if (engine !== undefined) {
      engine = formatEngineString(engine);
      style[engine + 'box-shadow'] = '0 0 15px #ccc';
    }
  
    style['border'] = '1px solid #c6c4c3';
    style['background'] = '#fff';
    style['position'] = 'absolute';

    shadow.css(style);
  }

  function propertySupported(property) {
    return document.body.style[property] !== undefined;
  }

  function formatEngineString(engine) {
    if (engine !== undefined) {
      return '-' + engine + '-';
    }
    else {
      return '';
    }
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

  return { 
    create: createPresenter
  };
});
