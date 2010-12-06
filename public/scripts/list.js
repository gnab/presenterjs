define(['common', 'presenter'], function (common, presenterFactory) {

  function wrapList() {
    var listElement = $('#list'),
        slides = [],
        currentSlide,
        currentSlideIndex;

    list = {
      resize: function (left, top, width, height) {
        common.resizeElement(listElement, left, top, width, height);
        resizeSlides(slides, width);
      },
      hide: function () {
        listElement.hide();
      },
      show: function () {
        listElement.show();
      },
      add: function(content) {
        var presenterElement = $('<div />'),
            presenter = presenterFactory.create(presenterElement),
            linkElement = $('<a href="#/show/' + (slides.length + 1)
              + '"></a>');

        slides.push({ element: presenterElement, presenter: presenter });
        linkElement.append(presenterElement);
        listElement.append(linkElement);
      },
      slide: function(no) {
        var slideIndex = parseInt(no, 10),
            slideHeigt, slideTop, slideBottom;

        if (slideIndex && slideIndex > 0 && slideIndex <= slides.length) {
          if (currentSlide) {
            currentSlide.element.removeClass('active');
          }
          currentSlide = slides[slideIndex - 1];
          currentSlide.element.addClass('active');
          currentSlideIndex = slideIndex - 1;

          slideHeight = currentSlide.element.height();
          slideTop = slideHeight * currentSlideIndex;
          slideBottom = slideTop + slideHeight;

          if (slideTop < listElement.scrollTop() ||
              slideBottom > listElement.height()+listElement.scrollTop()) {
            listElement.scrollTop(slideTop);
          }
        }
      },
      movePrevious: function () {
        if (!currentSlide && slides.length > 0) {
          list.slide(0);
        }
        if (currentSlideIndex > 0) {
          list.slide(currentSlideIndex);
        } 
      },
      moveNext: function () {
        if (!currentSlide && slides.length > 0) {
          list.slide(0);
        }
        if (currentSlideIndex < slides.length - 1) {
          list.slide(currentSlideIndex + 2);
        } 
      }
    };

    return list;
  }

  function resizeSlides(slides, width) {
    var key, element;

    for (key in slides) {
      if (slides.hasOwnProperty(key)) {
        slides[key].presenter.resize(undefined, undefined, width, 250); 
      }
    }
  }

  return wrapList();
});
