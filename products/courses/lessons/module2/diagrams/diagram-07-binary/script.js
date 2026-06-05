(function(){'use strict';
var components = [    {id:"bit",name:"Bit",category:"Processing",purpose:"The smallest unit of data in computing, representing either a 0 or a 1",description:"A bit is a binary digit that can be one of two values, typically representing off/on, false/true, or 0/1 in electrical circuits.",why:"All digital data is ultimately made of bits",analogy:"Like a light switch that can only be on or off",funFact:"The word bit is a contraction of binary digit coined by John Tukey in 1947",takeaway:"Everything a computer stores or processes is built from bits",mistake:"Bits aren\\'t physical objects—they\\'re states represented by voltage levels in circuits",descriptionDetailed:"Bits are physically represented by voltage levels in circuits (0V for 0, +3.3V for 1). In storage, bits are represented by magnetic polarity or charge in a floating gate. Groups of bits encode numbers, text, colors, and instructions."},    {id:"byte",name:"Byte",category:"Processing",purpose:"A group of 8 bits used as the standard unit of data storage",description:"A byte can represent 256 different values (0-255), enough to encode a single character, a small number, or part of a larger value.",why:"Bytes are the fundamental unit for memory addressing and file sizes",analogy:"Like a word made from 8 letters, where each letter is a bit",funFact:"The byte was originally variable-sized (4-6 bits) before standardizing to 8 bits in the 1960s",takeaway:"A byte is the basic unit for measuring data: KB, MB, GB, and TB",mistake:"A kilobyte is 1,024 bytes (2^10), not 1,000 bytes",descriptionDetailed:"8 bits form one byte, which is the smallest addressable unit of memory. A byte stores one ASCII character, a small integer (0-255), or part of a larger number."},    {id:"binary",name:"Binary Number System",category:"Processing",purpose:"A base-2 number system that computers use to represent all data",description:"Binary uses only two digits (0 and 1) to represent any number, with each position representing a power of 2 instead of powers of 10.",why:"Binary maps perfectly to the on/off nature of electronic circuits",analogy:"Like counting with only two symbols instead of the ten we normally use",funFact:"The binary system was described in ancient India and China over 2,000 years ago",takeaway:"Binary is the native language of computers—everything else is built on top of it",mistake:"Computers don\\'t think in decimal—all math is done in binary at the hardware level",descriptionDetailed:"In binary, each digit represents a power of 2. For example, binary 1101 = 1x8 + 1x4 + 0x2 + 1x1 = 13 decimal. Negative numbers use two\\'s complement representation."},    {id:"hex",name:"Hexadecimal",category:"Processing",purpose:"A base-16 number system used as a compact representation of binary data",description:"Hexadecimal uses 16 digits (0-9 and A-F) where each hex digit represents exactly 4 bits, making it much more readable than long binary strings.",why:"Hex provides a human-friendly way to view binary data",analogy:"Like shorthand for binary—2 hex characters replace 8 binary characters",funFact:"Hex is used for color codes in web design, like #FF0000 for red",takeaway:"Each hex digit represents 4 bits, so 2 hex digits = 1 byte",mistake:"Hex isn\\'t a different kind of data—it\\'s just a different way of writing the same binary values",descriptionDetailed:"Hexadecimal groups 4 bits into one digit (0-15 represented as 0-9, A-F). Programmers use hex for memory addresses, machine code, color values, and network addresses."},    {id:"ascii",name:"ASCII Encoding",category:"Processing",purpose:"Maps characters and symbols to numeric values for text representation",description:"ASCII assigns a unique 7-bit number (0-127) to each letter, digit, punctuation mark, and control character, standardizing text in computers.",why:"ASCII allows text to be stored and transmitted as binary data",analogy:"Like a secret code where each letter is replaced by a number",funFact:"ASCII was developed from telegraph codes and published in 1963",takeaway:"When you type a letter, the computer stores its ASCII number, not the letter itself",mistake:"ASCII only handles English characters—Unicode is needed for global language support",descriptionDetailed:"ASCII uses 7 bits to encode 128 characters: 33 control characters and 95 printable characters. \\'A\\' is 65, \\'a\\' is 97, \\'0\\' is 48."},    {id:"integer",name:"Integer Representation",category:"Processing",purpose:"Stores whole numbers in binary for arithmetic operations",description:"Integers are stored as fixed-width binary numbers, with methods for handling both positive values and negative values using two\\'s complement.",why:"Integer math is the foundation of all computer calculations",analogy:"Like writing numbers in binary instead of decimal",funFact:"Due to binary limitations, 0.1 + 0.2 doesn\\'t equal exactly 0.3 in floating point",takeaway:"Computers represent integers exactly but have limits based on bit width",mistake:"Integers wrap around on overflow—they don\\'t automatically use more bits",descriptionDetailed:"Unsigned integers store only non-negative values. Signed integers use two\\'s complement. Common sizes are 8-bit (byte), 16-bit (short), 32-bit (int), and 64-bit (long long)."}];
var connections = [{from:"bit",to:"byte"},{from:"byte",to:"binary"},{from:"binary",to:"hex"},{from:"hex",to:"ascii"},{from:"ascii",to:"integer"}];
var steps = [{label:"Step 1: Bit",status:"Exploring: Bit - The smallest unit of data in computing, representing either a 0 or a 1"},{label:"Step 2: Byte",status:"Exploring: Byte - A group of 8 bits used as the standard unit of data storage"},{label:"Step 3: Binary Number System",status:"Exploring: Binary Number System - A base-2 number system that computers use to represent all data"},{label:"Step 4: Hexadecimal",status:"Exploring: Hexadecimal - A base-16 number system used as a compact representation of binary data"},{label:"Step 5: ASCII Encoding",status:"Exploring: ASCII Encoding - Maps characters and symbols to numeric values for text representation"},{label:"Step 6: Integer Representation",status:"Exploring: Integer Representation - Stores whole numbers in binary for arithmetic operations"}];
var tour = [{title:"Bit",description:"The smallest unit of data in computing, representing either a 0 or a 1",componentId:"bit"},{title:"Byte",description:"A group of 8 bits used as the standard unit of data storage",componentId:"byte"},{title:"Binary Number System",description:"A base-2 number system that computers use to represent all data",componentId:"binary"},{title:"Hexadecimal",description:"A base-16 number system used as a compact representation of binary data",componentId:"hex"},{title:"ASCII Encoding",description:"Maps characters and symbols to numeric values for text representation",componentId:"ascii"},{title:"Integer Representation",description:"Stores whole numbers in binary for arithmetic operations",componentId:"integer"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Binary',
    subtitle: 'How Computers Work',
    desc: 'Discover how computers represent data using bits, bytes, and binary numbers.',
    module: 2,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Discover how computers represent data using bits and binary.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildStepFlow(container);
      engine._setStatus('Click any component to learn more');
    },
    
    animate: function(engine) {
      var svg = engine.el.visual.querySelector('svg');
      if (!svg || engine.selectedId || !engine.playing) return;
      var comps = svg.querySelectorAll('.component');
      var idx = Math.floor(engine.t * 0.5) % comps.length;
      comps.forEach(function(el, i) {
        var bg = el.querySelector('.component-bg');
        if (!bg) return;
        bg.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        bg.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },
    
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();