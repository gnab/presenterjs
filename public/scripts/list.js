define(['common'], function (common) {

  function wrapList() {
    var listElement = $('#list');

    return {
      resize: function (left, top, width, height) {
        common.resizeElement(listElement, left, top, width, height);
      },
      hide: function () {
        listElement.hide();
      },
      show: function () {
        listElement.show();
      }
    }
  }

  return wrapList();
});
