(function (window) {
  window.ss = window.ss || {};

  var types = {
    'NEWLINE': /[\n\r]/,
    'NUMBER': /[0-9\.]/,
    'TOKEN': /[^a-zA-Z0-9$_\s]/,
    'WHITESPACE': /\s/,
    'WORD': /[a-zA-Z0-9$_']/,
    'WORDSTART': /[a-zA-Z$_]/
  };

  window.ss.tokenize = function(input) {
    /*
    Heavily inspired by @thejameskyle: https://github.com/thejameskyle/the-super-tiny-compiler/blob/master/super-tiny-compiler.js
    */

    var current = 0;
    var tokens = [];
    var char, value;

    while (current < input.length) {
      char = input[current];

      if (types.WHITESPACE.test(char)) {
        if (types.NEWLINE.test(char)) {
          tokens.push(createToken('NEWLINE', null));
        }

        current++;
        continue;
      }

      if (types.NUMBER.test(char)) {
        value = '';

        while (types.NUMBER.test(char)) {
          value += char;
          char = input[++current];
        }

        tokens.push(createToken('NUMBER', value));
        continue;
      }

      if (types.WORDSTART.test(char)) {
        value = '';

        while (types.WORD.test(char) && char !== undefined) {
          value += char;
          char = input[++current];
        }

        tokens.push(createToken('WORD', value));
        continue;
      }

      if (types.TOKEN.test(char)) {
        tokens.push(createToken('TOKEN', char));
        current++;
        continue;
      }

      throw new Error('Tokenizer had a problem. Unrecognized character: ' + char);
    }

    return tokens;
  };

  function createToken(type, value) {
    return {
      'type': type,
      'value': value
    };
  }

})(window);
