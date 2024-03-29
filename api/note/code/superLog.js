//   ███████╗██╗   ██╗██████╗ ███████╗██████╗ ██╗      ██████╗  ██████╗ 
//   ██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗██╔════╝ 
//   ███████╗██║   ██║██████╔╝█████╗  ██████╔╝██║     ██║   ██║██║ ████╗
//   ╚════██║██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗██║     ██║   ██║██║   ██║
//   ███████║╚██████╔╝██║     ███████╗██║  ██║███████╗╚██████╔╝╚██████╔╝██╗
//   ╚══════╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝

// TODO
// # auto split too long sentenses with a dash
// # allow config overwrite when arguments passed
// # auto detect characters height
// # auto guess ideal sentense length

// CONFIG
var superLog_config = {
    // maximum line character
    max_line_length: 12,
    // characters height (maybe automatise later)
    char_height: 6,
    // space between lines
    line_spacing: 2
};

// ALPHABET
superLog_config.alphabet_404 = [
    "        ",
    "        ",
    "        ",
    "        ",
    "███████╗",
    "╚══════╝"
];
superLog_config.alphabet = [{
    "key": "a",
    "value": [
        " █████╗ ",
        "██╔══██╗",
        "███████║",
        "██╔══██║",
        "██║  ██║",
        "╚═╝  ╚═╝"
    ]
}, {
    "key": "b",
    "value": [
        "██████╗ ",
        "██╔══██╗",
        "██████╔╝",
        "██╔══██╗",
        "██████╔╝",
        "╚═════╝ "
    ]
}, {
    "key": "c",
    "value": [
        " ██████╗",
        "██╔════╝",
        "██║     ",
        "██║     ",
        "╚██████╗",
        " ╚═════╝"
    ]
}, {
    "key": "d",
    "value": [
        "██████╗ ",
        "██╔══██╗",
        "██║  ██║",
        "██║  ██║",
        "██████╔╝",
        "╚═════╝ "
    ]
}, {
    "key": "e",
    "value": [
        "███████╗",
        "██╔════╝",
        "█████╗  ",
        "██╔══╝  ",
        "███████╗",
        "╚══════╝"
    ]
}, {
    "key": "f",
    "value": [
        "███████╗",
        "██╔════╝",
        "█████╗  ",
        "██╔══╝  ",
        "██║     ",
        "╚═╝     "
    ]
}, {
    "key": "g",
    "value": [
        " ██████╗ ",
        "██╔════╝ ",
        "██║ ████╗",
        "██║   ██║",
        "╚██████╔╝",
        " ╚═════╝ "
    ]
}, {
    "key": "h",
    "value": [
        "██╗  ██╗",
        "██║  ██║",
        "███████║",
        "██╔══██║",
        "██║  ██║",
        "╚═╝  ╚═╝"
    ]
}, {
    "key": "i",
    "value": [
        "██╗",
        "██║",
        "██║",
        "██║",
        "██║",
        "╚═╝"
    ]
}, {
    "key": "j",
    "value": [
        "     ██╗",
        "     ██║",
        "     ██║",
        "██   ██║",
        "╚█████╔╝",
        " ╚════╝ "
    ]
}, {
    "key": "k",
    "value": [
        "██╗  ██╗",
        "██║ ██╔╝",
        "█████╔╝ ",
        "██╔═██╗ ",
        "██║  ██╗",
        "╚═╝  ╚═╝"
    ]
}, {
    "key": "l",
    "value": [
        "██╗     ",
        "██║     ",
        "██║     ",
        "██║     ",
        "███████╗",
        "╚══════╝"
    ]
}, {
    "key": "m",
    "value": [
        "███╗   ███╗",
        "████╗ ████║",
        "██╔████╔██║",
        "██║╚██╔╝██║",
        "██║ ╚═╝ ██║",
        "╚═╝     ╚═╝"
    ]
}, {
    "key": "n",
    "value": [
        "███╗   ██╗",
        "████╗  ██║",
        "██╔██╗ ██║",
        "██║╚██╗██║",
        "██║ ╚████║",
        "╚═╝  ╚═══╝"
    ]
}, {
    "key": "o",
    "value": [
        " ██████╗ ",
        "██╔═══██╗",
        "██║   ██║",
        "██║   ██║",
        "╚██████╔╝",
        " ╚═════╝ "
    ]
}, {
    "key": "p",
    "value": [
        "██████╗ ",
        "██╔══██╗",
        "██████╔╝",
        "██╔═══╝ ",
        "██║     ",
        "╚═╝     "
    ]
}, {
    "key": "q",
    "value": [
        " ██████╗  ",
        "██╔═══██╗ ",
        "██║   ██║ ",
        "██║  ███║ ",
        "╚█████ ██╗",
        " ╚═══════╝"
    ]
}, {
    "key": "r",
    "value": [
        "██████╗ ",
        "██╔══██╗",
        "██████╔╝",
        "██╔══██╗",
        "██║  ██║",
        "╚═╝  ╚═╝"
    ]
}, {
    "key": "s",
    "value": [
        "███████╗",
        "██╔════╝",
        "███████╗",
        "╚════██║",
        "███████║",
        "╚══════╝"
    ]
}, {
    "key": "t",
    "value": [
        "████████╗",
        "╚══██╔══╝",
        "   ██║   ",
        "   ██║   ",
        "   ██║   ",
        "   ╚═╝   "
    ]
}, {
    "key": "u",
    "value": [
        "██╗   ██╗",
        "██║   ██║",
        "██║   ██║",
        "██║   ██║",
        "╚██████╔╝",
        " ╚═════╝ "
    ]
}, {
    "key": "v",
    "value": [
        "██╗   ██╗",
        "██║   ██║",
        "██║   ██║",
        "██║   ██║",
        " ╚████╔╝ ",
        "  ╚═══╝  "
    ]
}, {
    "key": "w",
    "value": [
        "██╗    ██╗",
        "██║    ██║",
        "██║ █╗ ██║",
        "██║███╗██║",
        "╚███╔███╔╝",
        " ╚══╝╚══╝ "
    ]
}, {
    "key": "x",
    "value": [
        "██╗  ██╗",
        "╚██╗██╔╝",
        " ╚███╔╝ ",
        " ██╔██╗ ",
        "██╔╝ ██╗",
        "╚═╝  ╚═╝"
    ]
}, {
    "key": "y",
    "value": [
        "██╗   ██╗",
        " ██╗ ██╔╝",
        "  ████╔╝ ",
        "   ██╔╝  ",
        "   ██║   ",
        "   ╚═╝   "
    ]
}, {
    "key": "z",
    "value": [
        "███████╗",
        "╚═══██╔╝",
        "  ███╔╝ ",
        " ███╔╝  ",
        "███████╗",
        "╚══════╝"
    ]
}, {
    "key": "(",
    "value": [
        " ██╗",
        "██╔╝",
        "██║ ",
        "██║ ",
        "╚██╗",
        " ╚═╝"
    ]
}, {
    "key": ")",
    "value": [
        "██╗ ",
        "╚██╗",
        " ██║",
        " ██║",
        "██╔╝",
        "╚═╝ "
    ]
}, {
    "key": "<",
    "value": [
        "  ██╗",
        " ██╔╝",
        "██╔╝ ",
        "╚██╗ ",
        " ╚██╗",
        "  ╚═╝"
    ]
}, {
    "key": ">",
    "value": [
        "██╗  ",
        "╚██╗ ",
        " ╚██╗",
        " ██╔╝",
        "██╔╝ ",
        "╚═╝  "
    ]
}, {
    "key": ".",
    "value": [
        "   ",
        "   ",
        "   ",
        "   ",
        "██╗",
        "╚═╝"
    ]
}, {
    "key": "-",
    "value": [
        "      ",
        "      ",
        "█████╗",
        "╚════╝",
        "      ",
        "      "
    ]
}, {
    "key": " ",
    "value": [
        "      ",
        "      ",
        "      ",
        "      ",
        "      ",
        "      "
    ]
}, {
    "key": "!",
    "value": [
        "██╗",
        "██║",
        "██║",
        "╚═╝",
        "██╗",
        "╚═╝"
    ]
}, {
    "key": ",",
    "value": [
        "    ",
        "    ",
        "    ",
        "    ",
        " ██╗",
        "██═╝"
    ]
}, {
    "key": "3",
    "value": [
        " ███╗  ███╗ ",
        "█████╗█████╗",
        " █████████╔╝",
        "  ███████╔╝ ",
        "   ╚███╔═╝  ",
        "    ╚══╝    "
    ]
}, {
    "key": "_",
    "value": [
        "        ",
        "        ",
        "        ",
        "        ",
        "███████╗",
        "╚══════╝"
    ]
}];

// LINE STRUCTURE SPLIT
function lineStructure(_txt) {
    var _txt_array = _txt.split(' ');
    var _lines = [''],
        line_index = 0;

    for (var l in _txt_array) {
        if ((_lines[line_index].length + _txt_array[l].length + 1) <= superLog_config.max_line_length) {
            // word can fit with previous sentense
            _lines[line_index] += ((_lines[line_index].length > 0 ? ' ' : '') + _txt_array[l]);
        } else {
            // huge new line (maybe later split with a dash)
            // or simple new line
            line_index++;
            _lines[line_index] = _txt_array[l];
        }
    }

    return _lines;
}

function line2awesome(_lines_array) {
    var current_line, current_line_code,
        current_char, found_in_alphabet;
    wide_line = '';
    for (var l in _lines_array) {
        current_line = _lines_array[l].toLowerCase();
        
        // start by creating current line code
        current_line_code = [];
        for (var c in current_line) {
            current_char = current_line[c];
            // finding current char
            found_in_alphabet = false;
            for (var a in superLog_config.alphabet) {
                if (superLog_config.alphabet[a].key === current_char) {
                    current_line_code.push(a);
                    found_in_alphabet = true;
                    break;
                }
            }
            if (!found_in_alphabet) {
                // last char is the default one
                current_line_code.push(-1);
            }

        }

        // then replace and inject
        for (var i = 0; i < superLog_config.char_height; i++) {
            // for each line of the char awesome design
            for (var c in current_line_code) {
                if(current_line_code[c] > -1){
                    wide_line += superLog_config.alphabet[current_line_code[c]].value[i];
                }
                else {
                    wide_line += superLog_config.alphabet_404[i];
                }
            }
            wide_line += '\n';
        }
        wide_line += '\n';
    }
    return wide_line;
};

// MAIN
function superLog(_txt, _config) {
    if(_config){
        for(var key in _config){
            superLog_config[key] = _config[key];
        }
    }
    console.log(line2awesome(lineStructure(_txt)));
}

// TEST
// superLog('Hey, this is an awesome super logger.');