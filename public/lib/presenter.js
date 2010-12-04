define(function () {

  var dependenciesLoaded = false, delayedCreators = [];

  function create(id, callback) {
    if (dependenciesLoaded) {
      createPresenter(id, callback);
    }
    else {
      delayedCreators.push({ id: id, callback: callback });
    }
  }

  function createPresenter(id, callback) {
    var presenterElement = $('#' + id), 
        slide = createSlide(presenterElement);

    presenterElement.css({
      background: '#aaa',
      height: '100%',
      position: 'absolute'
    });

    callback({
      resize: function (left, top, width, height) {
        resizeElement(presenterElement, left, top, width, height);
        slide.resize(width, height);
      },
      content: function (content) {
        if (content !== undefined) {
          slide.content(content);
        }
        return slide.content();
      }
    });
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
      style[engine + 'box-shadow'] = '0 0 20px #777';
    }
  
    style['border'] = '1px solid transparent';
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

    resizeElement(element, dimensions.left, dimensions.top,
      dimensions.width, dimensions.height);

    resizeElement(shadow, dimensions.left, dimensions.top,
      dimensions.width * dimensions.scale,
      dimensions.height * dimensions.scale);

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

    gutterSize = gutterSize * zoomFactor / 100;

    slideWidth -= gutterSize * 2;
    slideHeight -= gutterSize * 2;

    slideLeft = (containerWidth - slideWidth) / 2;
    slideTop = (containerHeight - slideHeight) / 2;
    slideWidth = slideWidth * 100 / zoomFactor;
    slideHeight = slideHeight * 100 / zoomFactor;

    return {
      left: slideLeft,
      top: slideTop,
      width: slideWidth,
      height: slideHeight,
      scale: zoomFactor / 100,
    }
  }

  function resizeElement(element, left, top, width, height) {
    element.css({
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px',
    });
  }

  function loadDependencies() {
    require([
      'vendor/jquery-1.4.4.min', 
      'vendor/showdown',
      'vendor/html-sanitizer-minified',
      'vendor/highlight.min'
    ]);

    require.ready(function () {
      dependenciesLoaded = true;
      loadDelayedCreators();
    });
  }

  function loadDelayedCreators() {
    var key, creator;

    for (key in delayedCreators) {
      if (delayedCreators.hasOwnProperty(key)) {
        creator = delayedCreators[key]; 
        createPresenter(creator.id, creator.callback);
      }
    }
  }

  loadDependencies();

  return { create: create };
});
