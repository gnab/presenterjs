var key
  , reset = '\033[0m'
  , colors = {
      'black'	     : '\033[0;30m'
    , 'red'	     : '\033[0;31m'
    , 'green'	     : '\033[0;32m'
    , 'brown'	     : '\033[0;33m'
    , 'blue'	     : '\033[0;34m'
    , 'purple'	     : '\033[0;35m'
    , 'cyan'	     : '\033[0;36m'
    , 'light_gray'   : '\033[0;37m'
    , 'dark_gray'    : '\033[1;30m'
    , 'light_red'    : '\033[1;31m'
    , 'light_green'  : '\033[1;32m'
    , 'yellow'	     : '\033[1;33m'
    , 'light_blue'   : '\033[1;34m'
    , 'light_purple' : '\033[1;35m'
    , 'light_cyan'   : '\033[1;36m'
    , 'white'	     : '\033[1;37m'
  };

module.exports = colors;

for (key in colors) {
  String.prototype.__defineGetter__(key, (function (color) {
    return function () {
      return color + this + reset;
    };
  })(colors[key]));
}

if (!module.parent) {
  for (key in colors) {
    console.log(key[key]);
  }
}
