interface TypeDict {
  [type: string]: RegExp
}

const types: TypeDict = {
  'NEWLINE': /[\n\r]/,
  'NUMBER': /[0-9\.]/,
  'QUOTE': /['"]/,
  'SPACE': / /,
  'TOKEN': /[^a-zA-Z0-9$_'"\s]/,
  'WHITESPACE': /\s/,
  'WORD': /[a-zA-Z0-9$_']/,
  'WORDSTART': /[a-zA-Z$_]/
}

const tokenize = function(input: string, isDebug: boolean = false): Array<Token> {
  /*
  Heavily inspired by @thejameskyle: https://github.com/thejameskyle/the-super-tiny-compiler/blob/master/super-tiny-compiler.js
  */

  let current: number = 0
  let tokens: Array<Token> = []
  let char: string, value: string, endquote: string

  if (isDebug) {
    console.log('TOKENIZER...')
  }

  while (current < input.length) {
    char = input[current]

    if (types.WHITESPACE.test(char)) {
      if (types.NEWLINE.test(char)) {
        tokens.push(createToken('NEWLINE', '\n'))
      }

      if (types.SPACE.test(char)) {
        tokens.push(createToken('SPACE', ' '))
      }

      current++
      continue
    }

    if (types.NUMBER.test(char)) {
      value = ''

      while (types.NUMBER.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push(createToken('NUMBER', value))
      continue
    }

    if (types.QUOTE.test(char)) {
      endquote = char
      value = char
      char = input[++current]

      while (char !== endquote && char !== undefined) {
        if (char == '\\') {
          // If an escape slash is encountered, add it along with the subsequent character and do not test it to see if it is a quote.
          value += char
          char = input[++current]
        }

        value += char
        char = input[++current]
      }

      value += char
      current++

      tokens.push(createToken('QUOTE', value))
      continue
    }

    if (types.WORDSTART.test(char)) {
      value = ''

      while (types.WORD.test(char) && char !== undefined) {
        value += char
        char = input[++current]
      }

      tokens.push(createToken('WORD', value))
      continue
    }

    if (types.TOKEN.test(char)) {
      tokens.push(createToken('TOKEN', char))
      current++
      continue
    }

    throw new Error('Tokenizer had a problem. Unrecognized character: ' + char)
  }

  if (isDebug) {
    console.log('TOKENS: ', tokens)
  }

  return tokens
}

export interface Token {
  type: string
  value: string | null
}

const createToken = (type: string, value: string | null): Token => ({
  type: type,
  value: value
})

export default tokenize