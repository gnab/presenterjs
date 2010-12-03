var presenter = (function () {
  var dependencies = [
    'vendor/jquery-1.4.4.min', 
    'vendor/showdown',
    'vendor/html-sanitizer-minified',
    'vendor/highlight.min'
  ];

  var container, sidebar, editor, presenter, shadow, slide, content;

  function loadDependencies() {
    require(dependencies);

    require.ready(function () {
      loadEnvironment();
    });
  }

  function loadEnvironment() {
    bindToElements(); 

    loadLayout();
    loadMarkdown();
  }

  function bindToElements() {
    container = $(window);

    sidebar = $('#sidebar');
    editor = $('#editor');

    presenter = $('#presenter');
    shadow = $('#shadow');
    slide = $('#slide');
    content = $('#content');
  }

  function loadLayout() {
    loadSlide();

    container.resize(updateLayout);
    updateLayout();
  }

  function loadSlide() {
    loadSlideScaling();
    loadSlideShadow();
  }

  function loadSlideScaling() {
    var style = {};

    if (slideSupportsProperty('WebkitTransform')) {
      loadSlideScalingForEngine('webkit');
    }
    else if (slideSupportsProperty('MozTransform')) {
      loadSlideScalingForEngine('moz');
    }
    else if (slideSupportsProperty('OTransform')) {
      loadSlideScalingForEngine('o');
    }
    else if (slideSupportsProperty('transform')) {
      loadSlideScalingForEngine();
    }
    else if (slideSupportsProperty('zoom')) {
      scaleSlide = function (scale) {
        slide.css({'zoom': scale});;
      }
    }

    slide.css(style);
  }

  function slideSupportsProperty(property) {
    return slide[0].style[property] !== undefined;
  }

  function loadSlideScalingForEngine(engine) {
    var style = {};
    engine = formatEngineString(engine);
    scaleSlide = function (scale) {
      var style = {};
      style[engine + 'transform'] = 'scale(' + (scale) + ')';
      slide.css(style);
    };
    style[engine + 'transform-origin'] = '0 0';
    slide.css(style);
  }

  function loadSlideShadow() {
    if (slideSupportsProperty('WebkitTransform')) {
      loadSlideShadowForEngine('webkit');
    }
    else if (slideSupportsProperty('MozTransform')) {
      loadSlideShadowForEngine('moz');
    }
    else if (slideSupportsProperty('transform')) {
      loadSlideShadowForEngine();
    }
  }

  function loadSlideShadowForEngine(engine) {
    var style = {};
    engine = formatEngineString(engine);
    style[engine + 'box-shadow'] = '0 0 20px #777';
    slide.css(style);
  }

  function formatEngineString(engine) {
    if (engine !== undefined) {
      return '-' + engine + '-';
    }
    else {
      return '';
    }
  }

  function updateLayout() {
    resizeSidebar();

    resizePresenter(
      sidebar.outerWidth(), 
      0, 
      container.width() - sidebar.outerWidth(),
      container.height()
    );
  }

  function resizeSidebar() {
    var width = Math.floor(container.width() * 0.33);

    sidebar.css({
      width: width + 'px'
    });

    resizeEditor(width, container.height());
  }

  function resizeEditor(width, height) {
    var margin = 10;

    width -= margin * 2;
    height -= margin * 2;

    editor.css({
      width: width + 'px',
      height: height + 'px',
      left: margin + 'px',
      top: margin + 'px'
    });
  }

  function resizePresenter(left, top, width, height) {
    presenter.css({
      width: width + 'px',
      height: height + 'px',
      left: left + 'px',
      top: top + 'px'
    });

    resizeSlide(width, height);
  }

  function resizeSlide(presenterWidth, presenterHeight) {
    var dimensions;
       
    dimensions = calculateSlideDimensions(presenterWidth, presenterHeight);

    shadow.css({
      width: dimensions.width * dimensions.scale + 'px',
      height: dimensions.height * dimensions.scale + 'px', 
      left: dimensions.left + 'px',
      top: dimensions.top + 'px'
    });

    slide.css({
      width: dimensions.width + 'px',
      height: dimensions.height + 'px', 
      left: dimensions.left + 'px',
      top: dimensions.top + 'px'
    });

    scaleSlide(dimensions.scale);
  }

  function calculateSlideDimensions(presenterWidth, presenterHeight) {
    var slideWidth, slideHeight, slideLeft, slideTop, 
        widthFactor = 4, heightFactor = 3,
        gutterSize = 20, zoomFactor;

    if (presenterWidth / widthFactor > presenterHeight / heightFactor) {
      slideHeight = presenterHeight;
      slideWidth = slideHeight / heightFactor * widthFactor;
    } 
    else {
      slideWidth = presenterWidth;
      slideHeight = slideWidth / widthFactor * heightFactor;
    }

    zoomFactor = slideHeight / 6;

    gutterSize = gutterSize * zoomFactor / 100;

    slideWidth -= gutterSize * 2;
    slideHeight -= gutterSize * 2;

    slideLeft = (presenterWidth - slideWidth) / 2;
    slideTop = (presenterHeight - slideHeight) / 2;

    slideHeight = slideHeight * 100 / zoomFactor;
    slideWidth = slideWidth * 100 / zoomFactor;

    return {
      left: slideLeft,
      top: slideTop,
      width: slideWidth,
      height: slideHeight,
      scale: zoomFactor / 100,
    }
  }

  function loadMarkdown() {
    var converter = new Showdown.converter();

    var convert = function () {
      var markdown = editor.val(),
          html = converter.makeHtml(markdown),
          sanitizedHtml = sanitizeHtml(html);

      //localStorage['markdown'] = markdown;
      
      content.html(sanitizedHtml);
      $('#content code').each(function(i, e) {
        hljs.highlightBlock(e, '  ');
      });
    };

    editor.bind("keyup", convert);
    editor.bind("paste", convert);
    
    // editor.val(localStorage['markdown']);

    convert();
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

  loadDependencies();

  return {
    
  };
})();
