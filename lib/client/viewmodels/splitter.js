!function (context) {
  var viewmodels = context.presenter.viewmodels;

  viewmodels.Splitter = Splitter;

  function Splitter () {
    var self = this
      , offset
      ;

    this.resizing = ko.observable(false);

    this.mousedown = function (e) {
      offset = e.offsetX;
      self.resizing(true);
      return false;
    }

    $(context).bind('mousemove', function (e) {
      if (self.resizing()) {
        var width = e.clientX - offset;
        $('.panel')[0].style.width = width + 'px';
        $('#presenter')[0].style.left = width + 10 + 'px';
        return false;
      }
    });

    $(context).bind('mouseup', function (e) {
      self.resizing() && self.resizing(false);
    });
  }
}(this);
