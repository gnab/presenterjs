define(['model'], function (Model) {

  Slide.inherit(Model);

  function Slide(content) {
    this.content(content);
  }

  Slide.prototype.content = Model.createProperty('content');

  return Slide;

});
