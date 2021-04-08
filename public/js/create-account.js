(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/create-account"],{

/***/ "./node_modules/card-validator/index.js":
/*!**********************************************!*\
  !*** ./node_modules/card-validator/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  number: __webpack_require__(/*! ./src/card-number */ "./node_modules/card-validator/src/card-number.js"),
  expirationDate: __webpack_require__(/*! ./src/expiration-date */ "./node_modules/card-validator/src/expiration-date.js"),
  expirationMonth: __webpack_require__(/*! ./src/expiration-month */ "./node_modules/card-validator/src/expiration-month.js"),
  expirationYear: __webpack_require__(/*! ./src/expiration-year */ "./node_modules/card-validator/src/expiration-year.js"),
  cvv: __webpack_require__(/*! ./src/cvv */ "./node_modules/card-validator/src/cvv.js"),
  postalCode: __webpack_require__(/*! ./src/postal-code */ "./node_modules/card-validator/src/postal-code.js"),
  creditCardType: __webpack_require__(/*! credit-card-type */ "./node_modules/credit-card-type/index.js")
};


/***/ }),

/***/ "./node_modules/card-validator/src/card-number.js":
/*!********************************************************!*\
  !*** ./node_modules/card-validator/src/card-number.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var luhn10 = __webpack_require__(/*! ./luhn-10 */ "./node_modules/card-validator/src/luhn-10.js");
var getCardTypes = __webpack_require__(/*! credit-card-type */ "./node_modules/credit-card-type/index.js");

function verification(card, isPotentiallyValid, isValid) {
  return {card: card, isPotentiallyValid: isPotentiallyValid, isValid: isValid};
}

function cardNumber(value, options) {
  var potentialTypes, cardType, isPotentiallyValid, isValid, i, maxLength;

  options = options || {};

  if (typeof value === 'number') {
    value = String(value);
  }

  if (typeof value !== 'string') { return verification(null, false, false); }

  value = value.replace(/\-|\s/g, '');

  if (!/^\d*$/.test(value)) { return verification(null, false, false); }

  potentialTypes = getCardTypes(value);

  if (potentialTypes.length === 0) {
    return verification(null, false, false);
  } else if (potentialTypes.length !== 1) {
    return verification(null, true, false);
  }

  cardType = potentialTypes[0];

  if (cardType.type === getCardTypes.types.UNIONPAY && options.luhnValidateUnionPay !== true) {
    isValid = true;
  } else {
    isValid = luhn10(value);
  }

  maxLength = Math.max.apply(null, cardType.lengths);

  for (i = 0; i < cardType.lengths.length; i++) {
    if (cardType.lengths[i] === value.length) {
      isPotentiallyValid = value.length !== maxLength || isValid;
      return verification(cardType, isPotentiallyValid, isValid);
    }
  }

  return verification(cardType, value.length < maxLength, false);
}

module.exports = cardNumber;


/***/ }),

/***/ "./node_modules/card-validator/src/cvv.js":
/*!************************************************!*\
  !*** ./node_modules/card-validator/src/cvv.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DEFAULT_LENGTH = 3;

function includes(array, thing) {
  var i = 0;

  for (; i < array.length; i++) {
    if (thing === array[i]) { return true; }
  }

  return false;
}

function max(array) {
  var maximum = DEFAULT_LENGTH;
  var i = 0;

  for (; i < array.length; i++) {
    maximum = array[i] > maximum ? array[i] : maximum;
  }

  return maximum;
}

function verification(isValid, isPotentiallyValid) {
  return {isValid: isValid, isPotentiallyValid: isPotentiallyValid};
}

function cvv(value, maxLength) {
  maxLength = maxLength || DEFAULT_LENGTH;
  maxLength = maxLength instanceof Array ? maxLength : [maxLength];

  if (typeof value !== 'string') { return verification(false, false); }
  if (!/^\d*$/.test(value)) { return verification(false, false); }
  if (includes(maxLength, value.length)) { return verification(true, true); }
  if (value.length < Math.min.apply(null, maxLength)) { return verification(false, true); }
  if (value.length > max(maxLength)) { return verification(false, false); }

  return verification(true, true);
}

module.exports = cvv;


/***/ }),

/***/ "./node_modules/card-validator/src/expiration-date.js":
/*!************************************************************!*\
  !*** ./node_modules/card-validator/src/expiration-date.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parseDate = __webpack_require__(/*! ./parse-date */ "./node_modules/card-validator/src/parse-date.js");
var expirationMonth = __webpack_require__(/*! ./expiration-month */ "./node_modules/card-validator/src/expiration-month.js");
var expirationYear = __webpack_require__(/*! ./expiration-year */ "./node_modules/card-validator/src/expiration-year.js");

function verification(isValid, isPotentiallyValid, month, year) {
  return {
    isValid: isValid,
    isPotentiallyValid: isPotentiallyValid,
    month: month,
    year: year
  };
}

function expirationDate(value, maxElapsedYear) {
  var date, monthValid, yearValid, isValidForThisYear;

  if (typeof value === 'string') {
    value = value.replace(/^(\d\d) (\d\d(\d\d)?)$/, '$1/$2');
    date = parseDate(value);
  } else if (value !== null && typeof value === 'object') {
    date = {
      month: String(value.month),
      year: String(value.year)
    };
  } else {
    return verification(false, false, null, null);
  }

  monthValid = expirationMonth(date.month);
  yearValid = expirationYear(date.year, maxElapsedYear);

  if (monthValid.isValid) {
    if (yearValid.isCurrentYear) {
      isValidForThisYear = monthValid.isValidForThisYear;
      return verification(isValidForThisYear, isValidForThisYear, date.month, date.year);
    }

    if (yearValid.isValid) {
      return verification(true, true, date.month, date.year);
    }
  }

  if (monthValid.isPotentiallyValid && yearValid.isPotentiallyValid) {
    return verification(false, true, null, null);
  }

  return verification(false, false, null, null);
}

module.exports = expirationDate;


/***/ }),

/***/ "./node_modules/card-validator/src/expiration-month.js":
/*!*************************************************************!*\
  !*** ./node_modules/card-validator/src/expiration-month.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function verification(isValid, isPotentiallyValid, isValidForThisYear) {
  return {
    isValid: isValid,
    isPotentiallyValid: isPotentiallyValid,
    isValidForThisYear: isValidForThisYear || false
  };
}

function expirationMonth(value) {
  var month, result;
  var currentMonth = new Date().getMonth() + 1;

  if (typeof value !== 'string') {
    return verification(false, false);
  }
  if (value.replace(/\s/g, '') === '' || value === '0') {
    return verification(false, true);
  }
  if (!/^\d*$/.test(value)) {
    return verification(false, false);
  }

  month = parseInt(value, 10);

  if (isNaN(value)) {
    return verification(false, false);
  }

  result = month > 0 && month < 13;

  return verification(result, result, result && month >= currentMonth);
}

module.exports = expirationMonth;


/***/ }),

/***/ "./node_modules/card-validator/src/expiration-year.js":
/*!************************************************************!*\
  !*** ./node_modules/card-validator/src/expiration-year.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE = 19;

function verification(isValid, isPotentiallyValid, isCurrentYear) {
  return {
    isValid: isValid,
    isPotentiallyValid: isPotentiallyValid,
    isCurrentYear: isCurrentYear || false
  };
}

function expirationYear(value, maxElapsedYear) {
  var currentFirstTwo, currentYear, firstTwo, len, twoDigitYear, valid, isCurrentYear;

  maxElapsedYear = maxElapsedYear || DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE;

  if (typeof value !== 'string') {
    return verification(false, false);
  }
  if (value.replace(/\s/g, '') === '') {
    return verification(false, true);
  }
  if (!/^\d*$/.test(value)) {
    return verification(false, false);
  }

  len = value.length;

  if (len < 2) {
    return verification(false, true);
  }

  currentYear = new Date().getFullYear();

  if (len === 3) {
    // 20x === 20x
    firstTwo = value.slice(0, 2);
    currentFirstTwo = String(currentYear).slice(0, 2);
    return verification(false, firstTwo === currentFirstTwo);
  }

  if (len > 4) {
    return verification(false, false);
  }

  value = parseInt(value, 10);
  twoDigitYear = Number(String(currentYear).substr(2, 2));

  if (len === 2) {
    isCurrentYear = twoDigitYear === value;
    valid = value >= twoDigitYear && value <= twoDigitYear + maxElapsedYear;
  } else if (len === 4) {
    isCurrentYear = currentYear === value;
    valid = value >= currentYear && value <= currentYear + maxElapsedYear;
  }

  return verification(valid, valid, isCurrentYear);
}

module.exports = expirationYear;


/***/ }),

/***/ "./node_modules/card-validator/src/lib/is-array.js":
/*!*********************************************************!*\
  !*** ./node_modules/card-validator/src/lib/is-array.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Polyfill taken from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill>.

module.exports = Array.isArray || function (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};


/***/ }),

/***/ "./node_modules/card-validator/src/luhn-10.js":
/*!****************************************************!*\
  !*** ./node_modules/card-validator/src/luhn-10.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Luhn algorithm implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


function luhn10(identifier) {
  var sum = 0;
  var alt = false;
  var i = identifier.length - 1;
  var num;

  while (i >= 0) {
    num = parseInt(identifier.charAt(i), 10);

    if (alt) {
      num *= 2;
      if (num > 9) {
        num = (num % 10) + 1; // eslint-disable-line no-extra-parens
      }
    }

    alt = !alt;

    sum += num;

    i--;
  }

  return sum % 10 === 0;
}

module.exports = luhn10;


/***/ }),

/***/ "./node_modules/card-validator/src/parse-date.js":
/*!*******************************************************!*\
  !*** ./node_modules/card-validator/src/parse-date.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var expirationYear = __webpack_require__(/*! ./expiration-year */ "./node_modules/card-validator/src/expiration-year.js");
var isArray = __webpack_require__(/*! ./lib/is-array */ "./node_modules/card-validator/src/lib/is-array.js");

function parseDate(value) {
  var month, len, year, yearValid;

  if (/\//.test(value)) {
    value = value.split(/\s*\/\s*/g);
  } else if (/\s/.test(value)) {
    value = value.split(/ +/g);
  }

  if (isArray(value)) {
    return {
      month: value[0],
      year: value.slice(1).join()
    };
  }

  len = value[0] === '0' || value.length > 5 ? 2 : 1;

  if (value[0] === '1') {
    year = value.substr(1);
    yearValid = expirationYear(year);
    if (!yearValid.isPotentiallyValid) {
      len = 2;
    }
  }

  month = value.substr(0, len);

  return {
    month: month,
    year: value.substr(month.length)
  };
}

module.exports = parseDate;


/***/ }),

/***/ "./node_modules/card-validator/src/postal-code.js":
/*!********************************************************!*\
  !*** ./node_modules/card-validator/src/postal-code.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DEFAULT_MIN_POSTAL_CODE_LENGTH = 3;

function verification(isValid, isPotentiallyValid) {
  return {isValid: isValid, isPotentiallyValid: isPotentiallyValid};
}

function postalCode(value, options) {
  var minLength;

  options = options || {};

  minLength = options.minLength || DEFAULT_MIN_POSTAL_CODE_LENGTH;

  if (typeof value !== 'string') {
    return verification(false, false);
  } else if (value.length < minLength) {
    return verification(false, true);
  }

  return verification(true, true);
}

module.exports = postalCode;


/***/ }),

/***/ "./node_modules/credit-card-type/index.js":
/*!************************************************!*\
  !*** ./node_modules/credit-card-type/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var testOrder;
var types = {};
var customCards = {};
var VISA = 'visa';
var MASTERCARD = 'mastercard';
var AMERICAN_EXPRESS = 'american-express';
var DINERS_CLUB = 'diners-club';
var DISCOVER = 'discover';
var ELO = 'elo';
var JCB = 'jcb';
var UNIONPAY = 'unionpay';
var MAESTRO = 'maestro';
var MIR = 'mir';
var CVV = 'CVV';
var CID = 'CID';
var CVC = 'CVC';
var CVN = 'CVN';
var CVP2 = 'CVP2';
var CVE = 'CVE';
var ORIGINAL_TEST_ORDER = [
  VISA,
  MASTERCARD,
  AMERICAN_EXPRESS,
  DINERS_CLUB,
  DISCOVER,
  JCB,
  UNIONPAY,
  MAESTRO,
  ELO,
  MIR
];

function clone(originalObject, persistPatterns) {
  var dupe, prefixPattern, exactPattern;

  if (!originalObject) { return null; }

  prefixPattern = originalObject.prefixPattern;
  exactPattern = originalObject.exactPattern;
  dupe = JSON.parse(JSON.stringify(originalObject));

  if (persistPatterns) {
    dupe.prefixPattern = prefixPattern;
    dupe.exactPattern = exactPattern;
  } else {
    delete dupe.prefixPattern;
    delete dupe.exactPattern;
  }

  return dupe;
}

testOrder = clone(ORIGINAL_TEST_ORDER);

types[VISA] = {
  niceType: 'Visa',
  type: VISA,
  prefixPattern: /^4/,
  exactPattern: new RegExp('^' +
    '4' +
    '(?!' +
      '31274|51416|57393|0117[89]|38935|5763[12]' + // Elo cards
    ')\\d{5,}' +
  '$'),
  gaps: [4, 8, 12],
  lengths: [16, 18, 19],
  code: {
    name: CVV,
    size: 3
  }
};

types[MASTERCARD] = {
  niceType: 'Mastercard',
  type: MASTERCARD,
  prefixPattern: /^(5|5[1-5]|2|22|222|222[1-9]|2[3-6]|27|27[0-2]|2720)$/,
  exactPattern: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)\d*$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: CVC,
    size: 3
  }
};

types[AMERICAN_EXPRESS] = {
  niceType: 'American Express',
  type: AMERICAN_EXPRESS,
  prefixPattern: /^(3|34|37)$/,
  exactPattern: /^3[47]\d*$/,
  isAmex: true,
  gaps: [4, 10],
  lengths: [15],
  code: {
    name: CID,
    size: 4
  }
};

types[DINERS_CLUB] = {
  niceType: 'Diners Club',
  type: DINERS_CLUB,
  prefixPattern: /^(3|3[0689]|30[0-5])$/,
  exactPattern: /^3(0[0-5]|[689])\d*$/,
  gaps: [4, 10],
  lengths: [14, 16, 19],
  code: {
    name: CVV,
    size: 3
  }
};

types[DISCOVER] = {
  niceType: 'Discover',
  type: DISCOVER,
  prefixPattern: /^(6|60|601|6011|65|65\d{1,4}|64|64[4-9])$/,
  exactPattern: new RegExp('^(' +
    '6011' +
    '|' +
    '65' +
      '(?!' + // Elo cards
        '003[1-3]' +
        '|' +
        '003[5-9]|004\\d|005[0-1]' +
        '|' +
        '040[5-9]|04[1-3]\\d' +
        '|' +
        '048[5-9]|049\\d|05[0-2]\\d|053[0-8]' +
        '|' +
        '054[1-9]|05[5-8]\\d|059[0-8]' +
        '|' +
        '070\\d|071[0-8]' +
        '|' +
        '072[0-7]' +
        '|' +
        '090[1-9]|09[1-6]\\d|097[0-8]' +
        '|' +
        '165[2-9]|16[6-7]\\d' +
        '|' +
        '50[0-1]\\d' +
        '|' +
        '502[1-9]|50[3-4]\\d|505[0-8]' +
      ')\\d{4}' +
    '|' +
    '64[4-9]' +
  ')\\d*$'),
  gaps: [4, 8, 12],
  lengths: [16, 19],
  code: {
    name: CID,
    size: 3
  }
};

types[JCB] = {
  niceType: 'JCB',
  type: JCB,
  prefixPattern: /^(2|21|213|2131|1|18|180|1800|3|35)$/,
  exactPattern: /^(2131|1800|35)\d*$/,
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: CVV,
    size: 3
  }
};

types[UNIONPAY] = {
  niceType: 'UnionPay',
  type: UNIONPAY,
  prefixPattern: /^((6|62|62\d|(621(?!83|88|98|99))|622(?!06)|627[0267]\d?|628(?!0|1)|629[1,2])|622018)$/,
  exactPattern: new RegExp('^(' +
    '(' +
      '620' +
      '|' +
      '(621(?!83|88|98|99))' +
      '|' +
      '622(?!06|018)' +
      '|' +
      '62[3-6]' +
      '|' +
      '627[026]' +
      '|' +
      '6277(?!80)\\d{2}' + // Elo card
      '|' +
      '628(?!0|1)' +
      '|' +
      '629[12]' +
    ')\\d*' +

    '|' +

    '622018\\d{12}' +
  ')$'),
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: CVN,
    size: 3
  }
};

types[MAESTRO] = {
  niceType: 'Maestro',
  type: MAESTRO,
  prefixPattern: /^(5|5[06-9]|6\d*)$/,
  exactPattern: new RegExp('^(' +
    '5[6-9]' +
    '|' +
    '50' +
      '(?!' + // Elo card ranges
        '6699|067[0-6][0-9]' +
        '|' +
        '677[0-8]' +
        '|' +
        '9[0-9][0-9][0-9]' +
      ')\\d{4}' +
    '|' +
    '67' +
    '|' +
    '63' +
      '(?!' + // More Elo card ranges
        '6297|6368' +
      ')\\d{4}' +
    ')\\d*$'
  ),
  gaps: [4, 8, 12],
  lengths: [12, 13, 14, 15, 16, 17, 18, 19],
  code: {
    name: CVC,
    size: 3
  }
};

types[ELO] = {
  niceType: 'Elo',
  type: ELO,
  prefixPattern: new RegExp('^(' +
    '[4-6]' +

    '|' +

    '4[035]|4[035]1' +
    '|' +
    '4011|40117|40117[89]' +
    '|' +
    '4312|43127|431274' +
    '|' +
    '438|4389|43893|438935' +
    '|' +
    '4514|45141|451416' +
    '|' +
    '457|457[36]|45739|45763|457393|45763[12]' +

    '|' +

    '50|50[69]' +
    '|' +
    '506[6-7]|50669|5067[0-7]|5067[0-6][0-9]|50677[0-8]' +
    '|' +
    '509[0-9]|509[0-9][0-9]|509[0-9][0-9][0-9]' +

    '|' +

    '6[235]|627|636|65[015]' +
    '|' +
    '6277|62778|627780' +
    '|' +
    '636[23]|63629|636297|63636|636368' +
    '|' +
    '650[0479]' +
    '|' +
    '6500[3-5]|65003[1-3]|65003[5-9]|65004[0-9]65005[01]' +
    '|' +
    '6504[0-3]|65040[5-9]|65041[0-9]' +
    '|' +
    '6505[4-9]|65054[1-9]|6505[5-8][0-9]|65059[0-8]' +
    '|' +
    '6507[0-2]|65070[0-9]|65071[0-8]|65072[0-7]' +
    '|' +
    '6509[0-7]|65090[1-9]|6509[1-6][0-9]|65097[0-8]' +
    '|' +
    '6516|6516[5-7]|65165[2-9]|6516[6-7][0-9]' +
    '|' +
    '6550|6550[0-5]|6550[01][0-9]|65502[1-9]|6550[3-4][0-9]|65505[0-8]' +
  ')$'),
  exactPattern: new RegExp('^(' +
    // Elo only ranges
    '4(31274|51416|57393)' +

    '|' +

    '50(' +
      '4175' +
      '|' +
      '6699|67[0-6][0-9]|677[0-8]' + // 506699-506778
      '|' +
      '9[0-9][0-9][0-9]' + // 509000-509999
    ')' +

    '|' +

    '627780' +

    '|' +

    '636(297|368)' +

    '|' +

    // Dual Branded with Visa
    '4(0117[89]|38935|5763[12])' +

    '|' +

    // Dual Branded with Discover
    '65(' +
      '003[1-3]' + // 650031-650033
      '|' +
      '003[5-9]|004\\d|005[0-1]' + // 650035-650051
      '|' +
      '040[5-9]|04[1-3]\\d' + // 650405-650439
      '|' +
      '048[5-9]|049\\d|05[0-2]\\d|053[0-8]' + // 650485-650538
      '|' +
      '054[1-9]|05[5-8]\\d|059[0-8]' + // 650541-650598
      '|' +
      '070[0-9]|071[0-8]' + // 650700-650718
      '|' +
      '072[0-7]' + // 650720-650727
      '|' +
      '090[1-9]|09[1-6][0-9]|097[0-8]' + // 650901-650978
      '|' +
      '165[2-9]|16[6-7][0-9]' + // 651652-651679
      '|' +
      '50[0-1][0-9]' + // 655000-655019
      '|' +
      '502[1-9]|50[3-4][0-9]|505[0-8]' + // 655021-655058
    ')' +
  ')\\d*$'),
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: CVE,
    size: 3
  }
};

types[MIR] = {
  niceType: 'Mir',
  type: MIR,
  prefixPattern: /^(2|22|220|220[0-4])$/,
  exactPattern: /^(220[0-4])\d*$/,
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: CVP2,
    size: 3
  }
};

function findType(type) {
  return customCards[type] || types[type];
}

function creditCardType(cardNumber) {
  var type, value, i;
  var prefixResults = [];
  var exactResults = [];

  if (!(typeof cardNumber === 'string' || cardNumber instanceof String)) {
    return [];
  }

  for (i = 0; i < testOrder.length; i++) {
    type = testOrder[i];
    value = findType(type);

    if (cardNumber.length === 0) {
      prefixResults.push(clone(value));
      continue;
    }

    if (value.exactPattern.test(cardNumber)) {
      exactResults.push(clone(value));
    } else if (value.prefixPattern.test(cardNumber)) {
      prefixResults.push(clone(value));
    }
  }

  return exactResults.length ? exactResults : prefixResults;
}

creditCardType.getTypeInfo = function (type) {
  return clone(findType(type));
};

function getCardPosition(name, ignoreErrorForNotExisting) {
  var position = testOrder.indexOf(name);

  if (!ignoreErrorForNotExisting && position === -1) {
    throw new Error('"' + name + '" is not a supported card type.');
  }

  return position;
}

creditCardType.removeCard = function (name) {
  var position = getCardPosition(name);

  testOrder.splice(position, 1);
};

creditCardType.addCard = function (config) {
  var existingCardPosition = getCardPosition(config.type, true);

  customCards[config.type] = config;

  if (existingCardPosition === -1) {
    testOrder.push(config.type);
  }
};

creditCardType.updateCard = function (cardType, updates) {
  var clonedCard;
  var originalObject = customCards[cardType] || types[cardType];

  if (!originalObject) {
    throw new Error('"' + cardType + '" is not a recognized type. Use `addCard` instead.');
  }

  if (updates.type && originalObject.type !== updates.type) {
    throw new Error('Cannot overwrite type parameter.');
  }

  clonedCard = clone(originalObject, true);

  Object.keys(clonedCard).forEach(function (key) {
    if (updates[key]) {
      clonedCard[key] = updates[key];
    }
  });

  customCards[clonedCard.type] = clonedCard;
};

creditCardType.changeOrder = function (name, position) {
  var currentPosition = getCardPosition(name);

  testOrder.splice(currentPosition, 1);
  testOrder.splice(position, 0, name);
};

creditCardType.resetModifications = function () {
  testOrder = clone(ORIGINAL_TEST_ORDER);
  customCards = {};
};

creditCardType.types = {
  VISA: VISA,
  MASTERCARD: MASTERCARD,
  AMERICAN_EXPRESS: AMERICAN_EXPRESS,
  DINERS_CLUB: DINERS_CLUB,
  DISCOVER: DISCOVER,
  JCB: JCB,
  UNIONPAY: UNIONPAY,
  MAESTRO: MAESTRO,
  ELO: ELO,
  MIR: MIR
};

module.exports = creditCardType;


/***/ }),

/***/ "./node_modules/es6-promise/auto.js":
/*!******************************************!*\
  !*** ./node_modules/es6-promise/auto.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// This file can be required in Browserify and Node.js for automatic polyfill
// To use it:  require('es6-promise/auto');

module.exports = __webpack_require__(/*! ./ */ "./node_modules/es6-promise/dist/es6-promise.js").polyfill();


/***/ }),

/***/ "./node_modules/es6-promise/dist/es6-promise.js":
/*!******************************************************!*\
  !*** ./node_modules/es6-promise/dist/es6-promise.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));



//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/AutoSuggest.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/AutoSuggest.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        options: {
            type: Array,
        },
        input_attrs: {
            type: Object,
            default: function () {
                return {};
            }
        },
        restricted: {
            type: Boolean,
            default: false
        },
        initial_value: {
            type: Object,
            required: false
        }
    },
    data: function () {
        return {
            /**
             * User-entered text input
             */
            active_input_text: "",
            /**
             * Index of the active suggestion
             */
            active_suggestion_index: -1,
            /**
             * The active tracked value for the component
             */
            active_value: {
                label: "",
                value: null
            },
            /**
             * Whether to hide the suggestions list
             */
            hide_suggestions: false,
            /**
             * Whether the input is currently focused
             */
            input_focused: false,
            /**
             * Whether an option from suggestions list has been clicked as the most recent action
             */
            option_clicked: false,
            /**
             * Whether the component has been loaded and should start emitting changes
             */
            loaded: false,
            suggestions: [],
            suggestions_debounce: false
        };
    },
    /**
     * Load initial value if present
     */
    created: function () {
        if (this.initial_value) {
            this.active_value = __assign({}, this.initial_value);
            this.active_input_text = this.initial_value.label;
        }
        this.loaded = true;
    },
    methods: {
        /**
         * Handle mousedown on suggestion
         */
        mouseDown: function () {
            this.option_clicked = true;
        },
        /**
         * Handle focus on input
         */
        handleFocus: function () {
            this.input_focused = true;
        },
        /**
         * Handle blur on input
         */
        handleBlur: function () {
            this.input_focused = false;
        },
        /**
         * Handle direct content change on input element
         */
        handleInput: function (event) {
            var _this = this;
            this.suggestions = [];
            this.option_clicked = false;
            this.active_value.value = null;
            this.active_value.label = event.target.value;
            if (this.suggestions_debounce) {
                clearTimeout(this.suggestions_debounce);
            }
            this.suggestions_debounce = window.setTimeout(function () {
                _this.suggestions = _this.getSuggestions();
                _this.suggestions_debounce = false;
            }, 200);
        },
        /**
         * Whether a suggest item is the active suggest item
         */
        isActive: function (index) {
            return index === this.active_suggestion_index;
        },
        /**
         * Handle the user tabbing out of input
         */
        handleTab: function () {
            if (this.hide_suggestions) {
                return;
            }
            if (this.active_suggestion) {
                this.select(this.active_suggestion);
            }
            if (this.suggestions.length === 1) {
                this.select(this.suggestions[0]);
            }
        },
        /**
         * Handle down key event
         */
        handleDown: function () {
            if (this.hide_suggestions) {
                return;
            }
            if (this.active_suggestion_index === this.suggestions.length - 1) {
                return;
            }
            this.active_suggestion_index++;
        },
        /**
         * Handle up key event
         */
        handleUp: function () {
            if (this.hide_suggestions) {
                return;
            }
            if (this.active_suggestion_index === -1) {
                return;
            }
            this.active_suggestion_index--;
        },
        /**
         * Handle enter key event
         */
        handleEnter: function () {
            if (this.active_suggestion) {
                this.select(this.active_suggestion);
            }
        },
        /**
         * Select a form option
         */
        select: function (option) {
            var _this = this;
            this.active_value = __assign({}, option);
            this.active_input_text = option.label;
            vue__WEBPACK_IMPORTED_MODULE_0__["default"].nextTick(function () {
                _this.hide_suggestions = true;
            });
        },
        /**
         * Handle component blur.
         * 1. Hide suggestions list
         * 2. If restricted version, and a valid value not picked, reset the display text
         */
        componentBlur: function () {
            this.hide_suggestions = true;
            if (this.restricted && !this.active_value.value) {
                this.active_input_text = "";
            }
        },
        /**
         * The suggestions based on current input
         */
        getSuggestions: function () {
            var _this = this;
            if (!this.options) {
                return [];
            }
            return this.options.filter(function (option) {
                if (!_this.active_input_text) {
                    return false;
                }
                return option.label.toLowerCase().indexOf(_this.active_input_text.toLowerCase()) !== -1;
            });
        }
    },
    computed: {
        /**
         * The active suggest item, if present
         */
        active_suggestion: function () {
            if (this.active_suggestion_index > -1 && this.active_suggestion_index < this.suggestions.length) {
                return this.suggestions[this.active_suggestion_index];
            }
            return false;
        },
        /**
         * Whether to show suggestions
         */
        show_suggestions: function () {
            if (!this.suggestions.length) {
                return false;
            }
            return !this.hide_suggestions;
        }
    },
    watch: {
        /**
         *  When the user changes the input, start showing results again and reset the active index
         */
        active_input_text: function () {
            this.hide_suggestions = false;
            this.active_suggestion_index = -1;
        },
        /**
         * When active value changes, emit the change
         */
        active_value: {
            handler: function (value) {
                if (!this.loaded) {
                    return;
                }
                if (this.restricted && value.value === null) {
                    this.$emit('input', {
                        label: null,
                        value: null
                    });
                    return;
                }
                this.$emit('input', value);
            },
            deep: true
        },
        /**
         * When input focus changes...
         */
        input_focused: function (value) {
            var _this = this;
            if (value === false) {
                vue__WEBPACK_IMPORTED_MODULE_0__["default"].nextTick(function () {
                    // if blur results from an option click, do nothing
                    if (_this.option_clicked) {
                        return;
                    }
                    //trigger component blur event
                    _this.componentBlur();
                });
            }
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/Captcha.vue?vue&type=script&lang=ts&":
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/Captcha.vue?vue&type=script&lang=ts& ***!
  \***************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    template: "<div></div>",
    props: {
        /**
         * Site key for library provided as property
         */
        site_key: {
            type: String,
            required: true
        }
    },
    methods: {
        /**
         * Upon captcha library load, render the captcha and attach appropriate properties
         */
        captchaLoaded: function () {
            grecaptcha.render(this.$el, {
                'sitekey': this.site_key,
                'callback': this.captchaCallback,
                'expired-callback': this.captchaExpiredCallback,
            });
        },
        /**
         * Captcha is completed.  Emit captcha value
         */
        captchaCallback: function (response) {
            this.$emit('input', response);
        },
        /**
         * Captcha is expired. Emit null value
         */
        captchaExpiredCallback: function () {
            this.$emit('input', null);
        },
    },
    /**
     * When component is mounted, add script to load captcha library and attach callbacks
     */
    mounted: function () {
        var _this = this;
        window.captchaLoad = function () {
            _this.captchaLoaded();
        };
        var script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js?onload=captchaLoad&render=explicit";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/DateInput.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/DateInput.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        initial: {
            required: false
        }
    },
    /**
     * Upon creation, assign default value if present
     */
    created: function () {
        this.value = this.initial ? String(this.initial) : "";
    },
    data: function () {
        return {
            value: "",
        };
    },
    methods: {
        valueChanged: function (value) {
            this.value = value;
        },
        export: function () {
            this.$emit('input', this.formatted);
        }
    },
    updated: function () {
        this.export();
    },
    computed: {
        formatted: function () {
            return this.value;
        }
    },
    watch: {
        /**
         * Watch initial value.  If it changes, update local value
         */
        initial: function () {
            this.value = this.initial ? String(this.initial) : '';
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/PopUp.vue?vue&type=script&lang=ts&":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/PopUp.vue?vue&type=script&lang=ts& ***!
  \*************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        math_center: {
            type: Boolean,
            default: false
        }
    },
    mounted: function () {
        document.addEventListener('click', this.bodyClick);
        document.addEventListener('touchstart', this.bodyClick);
        if (this.math_center) {
            this.mathCenter();
            window.addEventListener('resize', this.mathCenter);
        }
    },
    destroyed: function () {
        document.removeEventListener('click', this.bodyClick);
        document.removeEventListener('touchstart', this.bodyClick);
        window.removeEventListener('resize', this.mathCenter);
    },
    methods: {
        close: function () {
            this.$emit('close-popup');
        },
        bodyClick: function () {
            this.close();
        },
        isolateInteraction: function (event) {
            event.stopPropagation();
        },
        mathCenter: function () {
            var $el = this.$el;
            var top = Math.floor((window.innerHeight - $el.offsetHeight) / 2);
            var left = Math.floor((window.innerWidth - $el.offsetWidth) / 2);
            $el.style.top = top + 'px';
            $el.style.left = left + 'px';
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/SkateTestEquivalency/DisciplineForm.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/SkateTestEquivalency/DisciplineForm.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/FormMixin */ "./src/js/mixins/FormMixin.ts");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _models_SkateTestEquivalency_SkateTestDisciplineFormState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/SkateTestEquivalency/SkateTestDisciplineFormState */ "./src/js/models/SkateTestEquivalency/SkateTestDisciplineFormState.ts");
/* harmony import */ var _models_SkateTestEquivalency_SkateTestDisciplineFormValidator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../models/SkateTestEquivalency/SkateTestDisciplineFormValidator */ "./src/js/models/SkateTestEquivalency/SkateTestDisciplineFormValidator.ts");
/* harmony import */ var _components_AutoSuggest_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/AutoSuggest.vue */ "./src/js/components/AutoSuggest.vue");






/* harmony default export */ __webpack_exports__["default"] = (Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_2__["default"])(_mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__["default"]).extend({
    props: {
        existing_data: {
            type: Object,
            default: null
        },
        discipline_key: {
            type: String
        },
        form_test_options: {
            type: Array,
            required: false
        },
        is_equivalency: {
            type: Boolean,
            default: true
        },
        allow_cancel: {
            type: Boolean,
            default: true
        },
        external_error: {
            type: String,
            required: false
        },
        submitting: {
            type: Boolean,
            default: false
        },
        club_autosuggest: {
            type: Object,
            default: function () {
                return {
                    active: false,
                };
            }
        },
    },
    data: function () {
        return {
            dependencies: {
                club_options: false
            },
            form_data: new _models_SkateTestEquivalency_SkateTestDisciplineFormState__WEBPACK_IMPORTED_MODULE_3__["default"](this.is_equivalency),
            validator_class: _models_SkateTestEquivalency_SkateTestDisciplineFormValidator__WEBPACK_IMPORTED_MODULE_4__["SkateTestDisciplineFormValidator"]
        };
    },
    /**
     * Import existing data if it exists
     */
    created: function () {
        this.form_data.import(this.existing_data);
    },
    methods: {
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this.club_autosuggest.active) {
                    _this.dependencies.club_options = true;
                    resolve();
                    return;
                }
                var promises = [
                    _this.$store.dispatch('form_options/fetchClubs').then(function () {
                        _this.dependencies.club_options = true;
                    }).catch(function () {
                        reject();
                    })
                ];
                Promise.all(promises).then(function () {
                    resolve();
                });
            });
        },
        /**
         * Handle change event on club autosuggest input
         */
        clubChange: function (value) {
            this.form_data.club = value.label;
            this.form_data.club_id = value.value;
        },
        /**
         * Cancel the form
         */
        cancel: function () {
            this.$emit('cancel');
        },
        /**
         * Complete the form
         */
        complete: function () {
            this.submit_attempt = true;
            if (!this.valid) {
                return;
            }
            this.$emit('complete', this.form_data.export());
        }
    },
    computed: {
        /**
         * The minimum selectable test level based on existing selections
         */
        minimum_level: function () {
            if (this.existing_data) {
                return this.existing_data.test.level_id;
            }
            return 0;
        },
        /**
         * Options for the test input
         */
        test_options: function () {
            var _this = this;
            if (this.form_test_options) {
                return this.form_test_options;
            }
            var discipline_options = this.$store.getters['form_options/skate_test_options'](this.discipline_key);
            return discipline_options.filter(function (item) {
                return item.level_id >= _this.minimum_level;
            });
        },
        clubs: function () {
            return this.$store.getters['form_options/clubs'];
        },
        show_auto_suggest: function () {
            return this.club_autosuggest.active;
        }
    },
    components: {
        AutoSuggest: _components_AutoSuggest_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue?vue&type=script&lang=ts&":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue?vue&type=script&lang=ts& ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _DisciplineForm_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DisciplineForm.vue */ "./src/js/components/SkateTestEquivalency/DisciplineForm.vue");
/* harmony import */ var _store_Modules_SkateTestEquivalencyState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/Modules/SkateTestEquivalencyState */ "./src/js/store/Modules/SkateTestEquivalencyState.ts");



/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        external_error: {
            type: String,
            required: false
        },
        submitting: {
            type: Boolean,
            required: false
        }
    },
    /**
     * Upon creation, register the state module
     *
     * The component relies on testable disciplines and skate test options existing in
     * FormOptionsState.  As of this writing, this is handled by parent components
     */
    created: function () {
        this.$store.registerModule('skate_test_equivalency', _store_Modules_SkateTestEquivalencyState__WEBPACK_IMPORTED_MODULE_2__["SkateTestEquivalencyState"]);
    },
    data: function () {
        return {
            /**
             * The currently active discipline
             */
            active_discipline_key: null,
        };
    },
    methods: {
        /**
         * Add a discipline test
         */
        add: function (key) {
            this.active_discipline_key = key;
        },
        /**
         * Edit a discipline test
         */
        edit: function (key) {
            this.active_discipline_key = key;
        },
        /**
         * Remove a discipline test
         */
        remove: function (key) {
            this.$store.commit('skate_test_equivalency/removeDisciplineData', key);
        },
        /**
         * Whether a particular discipline is disabled
         */
        disciplineDisabled: function (key) {
            if (!this.active_discipline_key) {
                return false;
            }
            return this.active_discipline_key !== key;
        },
        /**
         * Whether a particular discipline is active
         */
        disciplineActive: function (key) {
            if (!this.active_discipline_key) {
                return false;
            }
            return this.active_discipline_key === key;
        },
        /**
         * Complete the component and emit exported data
         */
        complete: function () {
            var data = this.$store.getters['skate_test_equivalency/export_data'];
            this.$emit('complete', data);
        },
        /**
         * Cancel an active discipline form
         */
        cancelDisciplineForm: function () {
            this.active_discipline_key = null;
        },
        /**
         * Complete an active discipline form
         */
        completeDisciplineForm: function (form_data) {
            if (!this.active_discipline_key) {
                return;
            }
            this.$store.commit('skate_test_equivalency/addDisciplineData', {
                key: this.active_discipline_key,
                form_data: form_data
            });
            this.active_discipline_key = null;
        },
        /**
         * Get the active data for a discipline
         */
        discipline_data: function (key) {
            return this.$store.getters['skate_test_equivalency/discipline_data'](key);
        },
        /**
         * Get the test (if present) for a discipline
         */
        discipline_test: function (key) {
            return this.$store.getters['skate_test_equivalency/discipline_test'](key);
        },
        /**
         * Whether to show test information for a particular discipline
         */
        showExistingTest: function (discipline_key) {
            return !this.disciplineActive(discipline_key) && this.discipline_test(discipline_key);
        }
    },
    computed: {
        /**
         * List of disciplines to show
         */
        disciplines: function () {
            return this.$store.getters['skate_test_equivalency/testable_disciplines'];
        },
        /**
         * Whether all discipline add/edit/remove buttons should be disabled
         */
        disable_buttons: function () {
            return !!this.active_discipline_key || this.submitting;
        }
    },
    updated: function () {
        this.$emit('changed');
    },
    components: {
        DisciplineForm: _DisciplineForm_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/StepsIndicator.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/StepsIndicator.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * The number of total steps
         */
        available_step_count: {
            type: Number,
            required: true,
        },
        /**
         * The current step number
         */
        active_step_number: {
            type: Number,
            required: true,
        },
    },
    computed: {
        /**
         * The percentage of progress to show for completed steps
         */
        completed_progress: function () {
            return (this.active_step_number - 1) / (this.available_step_count - 1) * 100;
        },
        /**
         * The percentage of progress to show for next steps
         */
        next_progress: function () {
            return (this.active_step_number) / (this.available_step_count - 1) * 100;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/AccountTypeSelect.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/pages/CreateAccount/AccountTypeSelect.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    data: function () {
        return {
            active_info_modal_key: null
        };
    },
    methods: {
        /**
         * Select an account type
         */
        select: function (account_type_key) {
            this.$emit('type-selected', account_type_key);
        },
        /**
         * Launch the info modal for an account type
         */
        launchInfo: function (account_type_key, event) {
            var target = event.target;
            target.blur();
            this.active_info_modal_key = account_type_key;
        },
        /**
         * Close the info modal
         */
        closeInfo: function () {
            this.active_info_modal_key = null;
        }
    },
    computed: {
        /**
         * Whether the volunteer info modal is active
         */
        volunteer_info_active: function () {
            return this.active_info_modal_key === "volunteer";
        },
        /**
         * Whether the foreign info modal is active
         */
        foreign_info_active: function () {
            return this.active_info_modal_key === "foreign";
        },
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/AddressForm.vue?vue&type=script&lang=ts&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/pages/CreateAccount/AddressForm.vue?vue&type=script&lang=ts& ***!
  \****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_AddressFormMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/AddressFormMixin */ "./src/js/mixins/AddressFormMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");


/* harmony default export */ __webpack_exports__["default"] = (Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_AddressFormMixin__WEBPACK_IMPORTED_MODULE_0__["default"]).extend({}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/CreateAccount.vue?vue&type=script&lang=ts&":
/*!******************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/pages/CreateAccount/CreateAccount.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _PersonalInfoForm_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PersonalInfoForm.vue */ "./src/js/pages/CreateAccount/PersonalInfoForm.vue");
/* harmony import */ var _AddressForm_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AddressForm.vue */ "./src/js/pages/CreateAccount/AddressForm.vue");
/* harmony import */ var _EmergencyContactForm_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EmergencyContactForm.vue */ "./src/js/pages/CreateAccount/EmergencyContactForm.vue");
/* harmony import */ var _ForeignInfoForm_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ForeignInfoForm.vue */ "./src/js/pages/CreateAccount/ForeignInfoForm.vue");
/* harmony import */ var _PasswordForm_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PasswordForm.vue */ "./src/js/pages/CreateAccount/PasswordForm.vue");
/* harmony import */ var _AccountTypeSelect_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AccountTypeSelect.vue */ "./src/js/pages/CreateAccount/AccountTypeSelect.vue");
/* harmony import */ var _components_SkateTestEquivalency_SkateTestEquivalency_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/SkateTestEquivalency/SkateTestEquivalency.vue */ "./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue");








/**
 * Component to manage entire create account process
 */
/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * Whether data for blank emergency contact forms should be posted to the server
         */
        post_blank_emergency_contact: {
            type: Boolean,
            default: true
        }
    },
    /**
     * Handle data loading and loading state-related variables upon component creation
     */
    created: function () {
        this.initLoadingTimeout();
        this.loadData();
    },
    data: function () {
        return {
            /**
             * Used for dev.  All screens display
             */
            debug_mode: false,
            /**
             * The number (not index) of the active step
             */
            active_step_number: 1,
            /**
             * The key of the active screen
             */
            active_screen_key: "landing",
            /**
             * Any server errors returned by a submission for the current screen
             */
            screen_server_error: "",
            /**
             * Specific to personal information, if the submission results in a duplicate account flag
             */
            duplicate_account_attempt: false,
            /**
             * Whether the component is in the process of submitting to the server
             */
            submitting: false,
            /**
             * Dependencies for component loading
             */
            dependencies: {
                form_options: false
            },
            /**
             * Whether there was an error loading component dependencies
             */
            load_error: false,
            /**
             * Timeout after which to display a loading message if data is not yet loaded
             */
            loading_timeout: false,
        };
    },
    methods: {
        /**
         * Start the loading timeout.  Log value after expiration
         */
        initLoadingTimeout: function () {
            var _this = this;
            setTimeout(function () {
                _this.loading_timeout = true;
            }, 200);
        },
        /**
         * Load dependencies
         */
        loadData: function () {
            var _this = this;
            this.$store.dispatch('form_options/fetchCreateAccountOptions').then(function () {
                _this.dependencies.form_options = true;
            }).catch(function () {
                _this.dependencies.form_options = true;
                _this.load_error = true;
            });
        },
        /**
         * Whether to show a particular screen
         */
        showScreen: function (screen_key) {
            if (this.debug_mode) {
                return true;
            }
            if (this.active_screen_key === "all") {
                return true;
            }
            return screen_key === this.active_screen_key;
        },
        /**
         * Clear the currently logged server error
         */
        clearServerError: function () {
            this.screen_server_error = "";
            this.duplicate_account_attempt = false;
        },
        /**
         * Handle the selection of an account type
         */
        selectAccountType: function (account_type) {
            this.$store.commit('setAccountTypeKey', account_type);
            this.active_screen_key = "personal_info";
        },
        /**
         * Handle completion event on personal info form.
         * Submit data to server and respond to response
         */
        completePersonalInfo: function (exported_form_data) {
            var _this = this;
            this.clearServerError();
            if (this.submitting) {
                return;
            }
            this.submitting = true;
            this.$store.dispatch('completePersonalInformation', exported_form_data).then(function (response) {
                _this.submitting = false;
                if (response.success) {
                    _this.active_screen_key = "address";
                    _this.active_step_number++;
                    return;
                }
                _this.screen_server_error = response.error;
                if (response.is_duplicate_account) {
                    _this.duplicate_account_attempt = true;
                }
            }).catch(function () {
                _this.submitting = false;
                _this.screen_server_error = "There was an error submitting your information";
            });
        },
        /**
         * Handle cancel event on personal info form
         */
        cancelPersonalInfo: function () {
            if (this.submitting) {
                return;
            }
            this.clearServerError();
            this.$store.commit('setAccountTypeKey', null);
            this.active_screen_key = "landing";
        },
        /**
         * Handle completion event on address form.
         * Submit data to server and respond to response
         */
        completeAddress: function (exported_form_data) {
            var _this = this;
            if (this.submitting) {
                return;
            }
            this.submitting = true;
            this.clearServerError();
            this.$store.dispatch('completeAddress', exported_form_data).then(function (response) {
                _this.submitting = false;
                if (response.success) {
                    _this.active_screen_key = "emergency_contact";
                    _this.active_step_number++;
                    return;
                }
                _this.screen_server_error = response.error;
            }).catch(function () {
                _this.submitting = false;
                _this.screen_server_error = "There was an error submitting your information";
            });
        },
        /**
         * Whether the emergency contact form is blank
         */
        isEmergencyContactFormBlank: function (exported_form_data) {
            return exported_form_data.name === "" &&
                exported_form_data.phone === "" &&
                exported_form_data.relationship === "";
        },
        /**
         * Actions following completion of emergency contact form:
         *  - Increment active step number
         *  - Advance to next screen in the process (location depends on whether the active registration is
         *    domestic or foreign).
         */
        afterCompleteEmergencyContact: function () {
            this.active_step_number++;
            if (this.requires_federation_info) {
                this.active_screen_key = "federation";
                return;
            }
            this.active_screen_key = "password";
        },
        /**
         * Handle completion event on emergency contact form.
         * Submit data to server and respond to response
         */
        completeEmergencyContact: function (exported_form_data) {
            var _this = this;
            if (this.submitting) {
                return;
            }
            if (this.post_blank_emergency_contact !== true && this.isEmergencyContactFormBlank(exported_form_data)) {
                this.afterCompleteEmergencyContact();
                return;
            }
            this.submitting = true;
            this.clearServerError();
            this.$store.dispatch('completeEmergencyContact', exported_form_data).then(function (response) {
                _this.submitting = false;
                if (response.success) {
                    _this.afterCompleteEmergencyContact();
                    return;
                }
                _this.screen_server_error = response.error;
            }).catch(function () {
                _this.submitting = false;
                _this.screen_server_error = "There was an error submitting your information";
            });
        },
        /**
         * Handle completion event on federation information form.
         * Submit data to server and respond to response
         */
        completeFederationInfo: function (exported_form_data) {
            var _this = this;
            if (this.submitting) {
                return;
            }
            this.submitting = true;
            this.clearServerError();
            this.$store.dispatch('completeFederationInformation', exported_form_data).then(function (response) {
                _this.submitting = false;
                if (response.success) {
                    _this.active_step_number++;
                    if (_this.skate_test_required) {
                        _this.active_screen_key = "skate_test";
                        return;
                    }
                    _this.active_screen_key = "password";
                    return;
                }
                _this.screen_server_error = response.error;
            }).catch(function () {
                _this.submitting = false;
                _this.screen_server_error = "There was an error submitting your information";
            });
        },
        /**
         * Handle completion event on skate test equivalency form.
         * Submit data to server and respond to response
         */
        completeSkateTestEquivalency: function (equivalency_data) {
            var _this = this;
            if (this.submitting) {
                return;
            }
            this.submitting = true;
            this.clearServerError();
            this.$store.dispatch('completeSkateTestEquivalency', equivalency_data).then(function (response) {
                _this.submitting = false;
                if (response.success) {
                    _this.active_step_number++;
                    _this.active_screen_key = "password";
                    return;
                }
                _this.screen_server_error = response.error;
            }).catch(function () {
                _this.submitting = false;
                _this.screen_server_error = "There was an error submitting your information";
            });
        },
        /**
         * Handle completion event on password form.
         * Submit data to server and respond to response
         *  - redirect to page contained in response
         */
        completePassword: function (exported_form_data) {
            var _this = this;
            if (this.submitting) {
                return;
            }
            this.submitting = true;
            this.clearServerError();
            this.$store.dispatch('completePassword', exported_form_data).then(function (response) {
                _this.submitting = false;
                if (response.success) {
                    window.location.assign(response.redirect_url);
                    return;
                }
                _this.screen_server_error = response.error;
            }).catch(function () {
                _this.submitting = false;
                _this.screen_server_error = "There was an error submitting your information";
            });
        }
    },
    computed: {
        /**
         * Whether the component data is fully loaded.
         */
        loaded: function () {
            for (var i in this.dependencies) {
                if (this.dependencies.hasOwnProperty(i)) {
                    var obj = this.dependencies[i];
                    if (obj !== true) {
                        return false;
                    }
                }
            }
            return true;
        },
        /**
         * Whether federation information needs to be filled out
         */
        requires_federation_info: function () {
            return this.$store.getters['requires_federation_info'];
        },
        /**
         * Whether skate test equivalency is required
         */
        skate_test_required: function () {
            return this.$store.getters['skate_test_required'];
        },
        /**
         * Total amount of required steps
         */
        required_step_count: function () {
            return this.$store.getters['required_step_count'];
        },
        /**
         * Whether to show the steps indicator
         */
        show_steps_indicator: function () {
            return this.account_type !== null;
        },
        /**
         * The selected account type
         */
        account_type: function () {
            return this.$store.state.account_type;
        },
        /**
         * The created member number for the active user
         * Null prior to completion of personal info form
         */
        member_number: function () {
            return this.$store.getters['member_number'];
        }
    },
    /**
     * Register sub-components
     */
    components: {
        PersonalInfoForm: _PersonalInfoForm_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
        AddressForm: _AddressForm_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
        EmergencyContactForm: _EmergencyContactForm_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
        ForeignInfoForm: _ForeignInfoForm_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
        PasswordForm: _PasswordForm_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
        AccountTypeSelect: _AccountTypeSelect_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
        SkateTestEquivalency: _components_SkateTestEquivalency_SkateTestEquivalency_vue__WEBPACK_IMPORTED_MODULE_7__["default"]
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/EmergencyContactForm.vue?vue&type=script&lang=ts&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/pages/CreateAccount/EmergencyContactForm.vue?vue&type=script&lang=ts& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/FormMixin */ "./src/js/mixins/FormMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _models_Forms_EmergencyContactFormState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/Forms/EmergencyContactFormState */ "./src/js/models/Forms/EmergencyContactFormState.ts");
/* harmony import */ var _models_CreateAccount_EmergencyContactFormValidator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/CreateAccount/EmergencyContactFormValidator */ "./src/js/models/CreateAccount/EmergencyContactFormValidator.ts");




/* harmony default export */ __webpack_exports__["default"] = (Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__["default"]).extend({
    data: function () {
        return {
            form_data: new _models_Forms_EmergencyContactFormState__WEBPACK_IMPORTED_MODULE_2__["EmergencyContactFormState"](),
            validator_class: _models_CreateAccount_EmergencyContactFormValidator__WEBPACK_IMPORTED_MODULE_3__["EmergencyContactFormValidator"],
        };
    },
    methods: {
        complete: function () {
            this.submit_attempt = true;
            if (!this.valid) {
                return;
            }
            this.$emit('complete', this.form_data.export());
        },
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/ForeignInfoForm.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/pages/CreateAccount/ForeignInfoForm.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/FormMixin */ "./src/js/mixins/FormMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _models_CreateAccount_FederationInfoFormState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/CreateAccount/FederationInfoFormState */ "./src/js/models/CreateAccount/FederationInfoFormState.ts");
/* harmony import */ var _models_CreateAccount_FederationInfoFormValidator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/CreateAccount/FederationInfoFormValidator */ "./src/js/models/CreateAccount/FederationInfoFormValidator.ts");




/* harmony default export */ __webpack_exports__["default"] = (Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__["default"]).extend({
    /**
     * The component relies on federation options existing in
     * FormOptionsState.  As of this writing, this is handled by parent components
     */
    created: function () {
        //
    },
    data: function () {
        return {
            form_data: new _models_CreateAccount_FederationInfoFormState__WEBPACK_IMPORTED_MODULE_2__["FederationInfoFormState"](),
            validator_class: _models_CreateAccount_FederationInfoFormValidator__WEBPACK_IMPORTED_MODULE_3__["FederationInfoFormValidator"],
            /**
             * Potential user types for selection on form
             */
            user_types: {
                "coach": "Foreign Coach",
                "skater": "Foreign Skater",
            }
        };
    },
    methods: {
        complete: function () {
            this.submit_attempt = true;
            if (!this.valid) {
                return;
            }
            this.$emit('complete', this.form_data.export());
        }
    },
    computed: {
        /**
         * Form options available to form
         */
        form_options: function () {
            return {
                federations: this.$store.getters['form_options/federations']
            };
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/PasswordForm.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/pages/CreateAccount/PasswordForm.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/FormMixin */ "./src/js/mixins/FormMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _models_CreateAccount_PasswordFormState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/CreateAccount/PasswordFormState */ "./src/js/models/CreateAccount/PasswordFormState.ts");
/* harmony import */ var _models_CreateAccount_PasswordFormValidator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/CreateAccount/PasswordFormValidator */ "./src/js/models/CreateAccount/PasswordFormValidator.ts");




/* harmony default export */ __webpack_exports__["default"] = (Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__["default"]).extend({
    data: function () {
        return {
            form_data: new _models_CreateAccount_PasswordFormState__WEBPACK_IMPORTED_MODULE_2__["PasswordFormState"](),
            validator_class: _models_CreateAccount_PasswordFormValidator__WEBPACK_IMPORTED_MODULE_3__["PasswordFormValidator"],
        };
    },
    methods: {
        complete: function () {
            this.submit_attempt = true;
            if (!this.valid) {
                return;
            }
            this.$emit('complete', this.form_data.export());
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/PersonalInfoForm.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/pages/CreateAccount/PersonalInfoForm.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_CreateAccount_PersonalInformationFormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/CreateAccount/PersonalInformationFormValidator */ "./src/js/models/CreateAccount/PersonalInformationFormValidator.ts");
/* harmony import */ var _models_CreateAccount_PersonalInformationFormState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/CreateAccount/PersonalInformationFormState */ "./src/js/models/CreateAccount/PersonalInformationFormState.ts");
/* harmony import */ var _mixins_FormMixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/FormMixin */ "./src/js/mixins/FormMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _components_Captcha_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/Captcha.vue */ "./src/js/components/Captcha.vue");





/* harmony default export */ __webpack_exports__["default"] = (Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_3__["default"])(_mixins_FormMixin__WEBPACK_IMPORTED_MODULE_2__["default"]).extend({
    props: {
        duplicate_account_attempt: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            form_data: new _models_CreateAccount_PersonalInformationFormState__WEBPACK_IMPORTED_MODULE_1__["PersonalInformationFormState"](),
            validator_class: _models_CreateAccount_PersonalInformationFormValidator__WEBPACK_IMPORTED_MODULE_0__["PersonalInformationFormValidator"],
        };
    },
    methods: {
        cancel: function () {
            this.$emit('cancel');
        },
        complete: function () {
            this.submit_attempt = true;
            if (!this.valid) {
                return;
            }
            this.$emit('complete', this.form_data.export());
        }
    },
    /**
     * Register subcomponents
     */
    components: {
        Captcha: _components_Captcha_vue__WEBPACK_IMPORTED_MODULE_4__["default"]
    }
}));


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/AutoSuggest.vue?vue&type=template&id=7e45a639&":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/AutoSuggest.vue?vue&type=template&id=7e45a639& ***!
  \********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "autosuggest" }, [
    _vm.input_attrs.type === "checkbox"
      ? _c(
          "input",
          _vm._b(
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.active_input_text,
                  expression: "active_input_text"
                }
              ],
              attrs: { type: "checkbox" },
              domProps: {
                checked: Array.isArray(_vm.active_input_text)
                  ? _vm._i(_vm.active_input_text, null) > -1
                  : _vm.active_input_text
              },
              on: {
                keydown: [
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")
                    ) {
                      return null
                    }
                    return _vm.handleTab($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                    ) {
                      return null
                    }
                    return _vm.handleEnter($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "up", 38, $event.key, [
                        "Up",
                        "ArrowUp"
                      ])
                    ) {
                      return null
                    }
                    $event.preventDefault()
                    return _vm.handleUp($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "down", 40, $event.key, [
                        "Down",
                        "ArrowDown"
                      ])
                    ) {
                      return null
                    }
                    $event.preventDefault()
                    return _vm.handleDown($event)
                  }
                ],
                focus: _vm.handleFocus,
                blur: _vm.handleBlur,
                input: _vm.handleInput,
                change: function($event) {
                  var $$a = _vm.active_input_text,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false
                  if (Array.isArray($$a)) {
                    var $$v = null,
                      $$i = _vm._i($$a, $$v)
                    if ($$el.checked) {
                      $$i < 0 && (_vm.active_input_text = $$a.concat([$$v]))
                    } else {
                      $$i > -1 &&
                        (_vm.active_input_text = $$a
                          .slice(0, $$i)
                          .concat($$a.slice($$i + 1)))
                    }
                  } else {
                    _vm.active_input_text = $$c
                  }
                }
              }
            },
            "input",
            _vm.input_attrs,
            false
          )
        )
      : _vm.input_attrs.type === "radio"
      ? _c(
          "input",
          _vm._b(
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.active_input_text,
                  expression: "active_input_text"
                }
              ],
              attrs: { type: "radio" },
              domProps: { checked: _vm._q(_vm.active_input_text, null) },
              on: {
                keydown: [
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")
                    ) {
                      return null
                    }
                    return _vm.handleTab($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                    ) {
                      return null
                    }
                    return _vm.handleEnter($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "up", 38, $event.key, [
                        "Up",
                        "ArrowUp"
                      ])
                    ) {
                      return null
                    }
                    $event.preventDefault()
                    return _vm.handleUp($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "down", 40, $event.key, [
                        "Down",
                        "ArrowDown"
                      ])
                    ) {
                      return null
                    }
                    $event.preventDefault()
                    return _vm.handleDown($event)
                  }
                ],
                focus: _vm.handleFocus,
                blur: _vm.handleBlur,
                input: _vm.handleInput,
                change: function($event) {
                  _vm.active_input_text = null
                }
              }
            },
            "input",
            _vm.input_attrs,
            false
          )
        )
      : _c(
          "input",
          _vm._b(
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.active_input_text,
                  expression: "active_input_text"
                }
              ],
              attrs: { type: _vm.input_attrs.type },
              domProps: { value: _vm.active_input_text },
              on: {
                keydown: [
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")
                    ) {
                      return null
                    }
                    return _vm.handleTab($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                    ) {
                      return null
                    }
                    return _vm.handleEnter($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "up", 38, $event.key, [
                        "Up",
                        "ArrowUp"
                      ])
                    ) {
                      return null
                    }
                    $event.preventDefault()
                    return _vm.handleUp($event)
                  },
                  function($event) {
                    if (
                      !("button" in $event) &&
                      _vm._k($event.keyCode, "down", 40, $event.key, [
                        "Down",
                        "ArrowDown"
                      ])
                    ) {
                      return null
                    }
                    $event.preventDefault()
                    return _vm.handleDown($event)
                  }
                ],
                focus: _vm.handleFocus,
                blur: _vm.handleBlur,
                input: [
                  function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.active_input_text = $event.target.value
                  },
                  _vm.handleInput
                ]
              }
            },
            "input",
            _vm.input_attrs,
            false
          )
        ),
    _vm._v(" "),
    _vm.show_suggestions
      ? _c("div", { staticClass: "autosuggest__suggestions" }, [
          _c("div", { staticClass: "autosuggest__suggestions__content" }, [
            _c(
              "ul",
              { staticClass: "autosuggest__list" },
              _vm._l(_vm.suggestions, function(value, index) {
                return _c(
                  "li",
                  {
                    staticClass: "autosuggest__list__item",
                    class: { active: _vm.isActive(index) },
                    on: {
                      mousedown: _vm.mouseDown,
                      touchstart: _vm.mouseDown,
                      click: function($event) {
                        _vm.select(value)
                      }
                    }
                  },
                  [_vm._v("\n\t\t\t\t\t" + _vm._s(value.label) + "\n\t\t\t\t")]
                )
              })
            )
          ])
        ])
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/DateInput.vue?vue&type=template&id=e6e2c8c0&":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/DateInput.vue?vue&type=template&id=e6e2c8c0& ***!
  \******************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("input", {
    staticClass: "form-field",
    attrs: { maxlength: "10", type: "text" },
    domProps: { value: _vm.formatted },
    on: {
      input: function($event) {
        _vm.valueChanged($event.target.value)
      }
    }
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/PopUp.vue?vue&type=template&id=d5651ca0&":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/PopUp.vue?vue&type=template&id=d5651ca0& ***!
  \**************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "popup",
      on: {
        click: function($event) {
          _vm.isolateInteraction($event)
        },
        touchstart: function($event) {
          _vm.isolateInteraction($event)
        }
      }
    },
    [
      _c("div", { staticClass: "popup__header" }, [
        _c(
          "h3",
          { staticClass: "popup__heading" },
          [_vm._t("heading-text", [_vm._v("Coach Ineligible")])],
          2
        ),
        _vm._v(" "),
        _c(
          "button",
          { staticClass: "popup__close", on: { click: _vm.close } },
          [_vm._v(" ")]
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "popup__content" }, [_vm._t("content")], 2)
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/StepsIndicator.vue?vue&type=template&id=055cc274&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/StepsIndicator.vue?vue&type=template&id=055cc274& ***!
  \***********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "steps-indicator" }, [
    _c(
      "ul",
      { staticClass: "steps-indicator__list" },
      _vm._l(_vm.available_step_count, function(step_number) {
        return _c(
          "li",
          {
            staticClass: "steps-indicator__item",
            class: {
              complete: _vm.active_step_number > step_number,
              active: _vm.active_step_number === step_number
            }
          },
          [
            _c("span", { staticClass: "steps-indicator__step" }, [
              _vm._v(_vm._s(step_number))
            ])
          ]
        )
      })
    ),
    _vm._v(" "),
    _c("div", { staticClass: "steps-indicator__progress" }, [
      _c("div", { staticClass: "steps-indicator__progress__bar" }, [
        _c(
          "span",
          {
            staticClass:
              "steps-indicator__progress__bar__indicator steps-indicator__progress__bar__indicator--complete",
            style: { width: _vm.completed_progress + "%" }
          },
          [_vm._v(" ")]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass:
              "steps-indicator__progress__bar__indicator steps-indicator__progress__bar__indicator--next",
            style: { width: _vm.next_progress + "%" }
          },
          [_vm._v(" ")]
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/js/adaptors/APIAdaptors/CreateAccountAPIAdaptor.ts":
/*!****************************************************************!*\
  !*** ./src/js/adaptors/APIAdaptors/CreateAccountAPIAdaptor.ts ***!
  \****************************************************************/
/*! exports provided: CreateAccountAPIAdaptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateAccountAPIAdaptor", function() { return CreateAccountAPIAdaptor; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var CreateAccountAPIAdaptor = /** @class */ (function () {
    function CreateAccountAPIAdaptor() {
    }
    /**
     * Adapt the response from the Personal Information submission endpoint
     */
    CreateAccountAPIAdaptor.adaptPersonalInformationSubmissionResponse = function (data) {
        if (data.success !== true) {
            return {
                success: false,
                error: data.error ? data.error : "There was an error submitting your information",
                is_duplicate_account: data.is_duplicate_account ? data.is_duplicate_account : false
            };
        }
        return {
            success: true,
            error: "",
            is_duplicate_account: false,
            data: __assign({}, data.data)
        };
    };
    /**
     * Adapt personal information data to an API Payload
     */
    CreateAccountAPIAdaptor.adaptExportedPersonalInformationFormToAPIPayload = function (payload, account_type) {
        return {
            personal_information_data: __assign({}, payload),
            account_type: account_type
        };
    };
    /**
     * Adapt address data to an API Payload
     */
    CreateAccountAPIAdaptor.adaptExportedAddressFormToAPIPayload = function (payload, account_id) {
        return {
            account_id: account_id,
            address_data: __assign({}, payload)
        };
    };
    /**
     * Adapt the response from the address submission endpoint
     */
    CreateAccountAPIAdaptor.adaptAddressSubmissionResponse = function (data) {
        return CreateAccountAPIAdaptor.adaptBaseSubmissionResponse(data);
    };
    /**
     * Adapt a generic API submission response
     */
    CreateAccountAPIAdaptor.adaptBaseSubmissionResponse = function (data) {
        if (data.success) {
            return {
                success: true,
                error: ""
            };
        }
        return {
            success: false,
            error: data.error
        };
    };
    /**
     * Adapt emergency contact data to an API Payload
     */
    CreateAccountAPIAdaptor.adaptExportedEmergencyContactFormToAPIPayload = function (payload, account_id) {
        return {
            account_id: account_id,
            emergency_contact_data: __assign({}, payload)
        };
    };
    /**
     * Adapt the response from the emergency contact submission endpoint
     */
    CreateAccountAPIAdaptor.adaptExportedEmergencyContactSubmissionResponse = function (data) {
        return CreateAccountAPIAdaptor.adaptBaseSubmissionResponse(data);
    };
    /**
     * Adapt password data to an API Payload
     */
    CreateAccountAPIAdaptor.adaptExportedPasswordFormToAPIPayload = function (payload, account_id) {
        return {
            account_id: account_id,
            password_data: __assign({}, payload)
        };
    };
    /**
     * Adapt the response from the password submission endpoint
     */
    CreateAccountAPIAdaptor.adaptPasswordSubmissionResponse = function (data) {
        if (data.success !== true) {
            return {
                success: false,
                error: data.error ? data.error : "There was an error submitting your information"
            };
        }
        return {
            success: true,
            error: "",
            redirect_url: data.redirect_url
        };
    };
    /**
     * Adapt federation information data to an API Payload
     */
    CreateAccountAPIAdaptor.adaptExportedFederationInfoFormToAPIPayload = function (payload, account_id) {
        return {
            account_id: account_id,
            federation_information_data: __assign({}, payload)
        };
    };
    /**
     * Adapt the response from the federation information submission endpoint
     */
    CreateAccountAPIAdaptor.adaptFederationInformationSubmissionResponse = function (data) {
        return CreateAccountAPIAdaptor.adaptBaseSubmissionResponse(data);
    };
    return CreateAccountAPIAdaptor;
}());



/***/ }),

/***/ "./src/js/adaptors/APIAdaptors/SkateTestEquivalencyAPIAdaptor.ts":
/*!***********************************************************************!*\
  !*** ./src/js/adaptors/APIAdaptors/SkateTestEquivalencyAPIAdaptor.ts ***!
  \***********************************************************************/
/*! exports provided: SkateTestEquivalencyAPIAdaptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkateTestEquivalencyAPIAdaptor", function() { return SkateTestEquivalencyAPIAdaptor; });
/**
 * Class to adapt data to and from structures used by API endpoints
 */
var SkateTestEquivalencyAPIAdaptor = /** @class */ (function () {
    function SkateTestEquivalencyAPIAdaptor() {
    }
    /**
     * Adapt the response from the skate test equivalency submission endpoint
     */
    SkateTestEquivalencyAPIAdaptor.adaptSkateTestEquivalencySubmissionResponse = function (data) {
        if (data.success) {
            return {
                success: true,
                error: ""
            };
        }
        return {
            success: false,
            error: data.error
        };
    };
    /**
     * Adapt skate test equivalency data to an API Payload
     */
    SkateTestEquivalencyAPIAdaptor.adaptSkateTestEquivalencyStateDataToAPIPayload = function (payload, account_id) {
        var result = {};
        for (var i in payload) {
            result[i] = null;
            var payloadElement = payload[i];
            if (payloadElement) {
                result[i] = {
                    club: payloadElement.club,
                    club_id: payloadElement.club_id,
                    date: payloadElement.date,
                    test: payloadElement.test.value
                };
            }
        }
        return {
            account_id: account_id,
            skate_test_data: result
        };
    };
    return SkateTestEquivalencyAPIAdaptor;
}());



/***/ }),

/***/ "./src/js/components/AutoSuggest.vue":
/*!*******************************************!*\
  !*** ./src/js/components/AutoSuggest.vue ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AutoSuggest_vue_vue_type_template_id_7e45a639___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AutoSuggest.vue?vue&type=template&id=7e45a639& */ "./src/js/components/AutoSuggest.vue?vue&type=template&id=7e45a639&");
/* harmony import */ var _AutoSuggest_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AutoSuggest.vue?vue&type=script&lang=ts& */ "./src/js/components/AutoSuggest.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AutoSuggest_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AutoSuggest_vue_vue_type_template_id_7e45a639___WEBPACK_IMPORTED_MODULE_0__["render"],
  _AutoSuggest_vue_vue_type_template_id_7e45a639___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/AutoSuggest.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/AutoSuggest.vue?vue&type=script&lang=ts&":
/*!********************************************************************!*\
  !*** ./src/js/components/AutoSuggest.vue?vue&type=script&lang=ts& ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_AutoSuggest_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/ts-loader??ref--5!../../../node_modules/vue-loader/lib??vue-loader-options!./AutoSuggest.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/AutoSuggest.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_AutoSuggest_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/AutoSuggest.vue?vue&type=template&id=7e45a639&":
/*!**************************************************************************!*\
  !*** ./src/js/components/AutoSuggest.vue?vue&type=template&id=7e45a639& ***!
  \**************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AutoSuggest_vue_vue_type_template_id_7e45a639___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./AutoSuggest.vue?vue&type=template&id=7e45a639& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/AutoSuggest.vue?vue&type=template&id=7e45a639&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AutoSuggest_vue_vue_type_template_id_7e45a639___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AutoSuggest_vue_vue_type_template_id_7e45a639___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/components/Captcha.vue":
/*!***************************************!*\
  !*** ./src/js/components/Captcha.vue ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Captcha_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Captcha.vue?vue&type=script&lang=ts& */ "./src/js/components/Captcha.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _Captcha_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/Captcha.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/Captcha.vue?vue&type=script&lang=ts&":
/*!****************************************************************!*\
  !*** ./src/js/components/Captcha.vue?vue&type=script&lang=ts& ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_Captcha_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/ts-loader??ref--5!../../../node_modules/vue-loader/lib??vue-loader-options!./Captcha.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/Captcha.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_Captcha_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/DateInput.vue":
/*!*****************************************!*\
  !*** ./src/js/components/DateInput.vue ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DateInput_vue_vue_type_template_id_e6e2c8c0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DateInput.vue?vue&type=template&id=e6e2c8c0& */ "./src/js/components/DateInput.vue?vue&type=template&id=e6e2c8c0&");
/* harmony import */ var _DateInput_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DateInput.vue?vue&type=script&lang=ts& */ "./src/js/components/DateInput.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _DateInput_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DateInput_vue_vue_type_template_id_e6e2c8c0___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DateInput_vue_vue_type_template_id_e6e2c8c0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/DateInput.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/DateInput.vue?vue&type=script&lang=ts&":
/*!******************************************************************!*\
  !*** ./src/js/components/DateInput.vue?vue&type=script&lang=ts& ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_DateInput_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/ts-loader??ref--5!../../../node_modules/vue-loader/lib??vue-loader-options!./DateInput.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/DateInput.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_DateInput_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/DateInput.vue?vue&type=template&id=e6e2c8c0&":
/*!************************************************************************!*\
  !*** ./src/js/components/DateInput.vue?vue&type=template&id=e6e2c8c0& ***!
  \************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DateInput_vue_vue_type_template_id_e6e2c8c0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./DateInput.vue?vue&type=template&id=e6e2c8c0& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/DateInput.vue?vue&type=template&id=e6e2c8c0&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DateInput_vue_vue_type_template_id_e6e2c8c0___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DateInput_vue_vue_type_template_id_e6e2c8c0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/components/PopUp.vue":
/*!*************************************!*\
  !*** ./src/js/components/PopUp.vue ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PopUp_vue_vue_type_template_id_d5651ca0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PopUp.vue?vue&type=template&id=d5651ca0& */ "./src/js/components/PopUp.vue?vue&type=template&id=d5651ca0&");
/* harmony import */ var _PopUp_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PopUp.vue?vue&type=script&lang=ts& */ "./src/js/components/PopUp.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PopUp_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PopUp_vue_vue_type_template_id_d5651ca0___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PopUp_vue_vue_type_template_id_d5651ca0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/PopUp.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/PopUp.vue?vue&type=script&lang=ts&":
/*!**************************************************************!*\
  !*** ./src/js/components/PopUp.vue?vue&type=script&lang=ts& ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_PopUp_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/ts-loader??ref--5!../../../node_modules/vue-loader/lib??vue-loader-options!./PopUp.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/PopUp.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_PopUp_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/PopUp.vue?vue&type=template&id=d5651ca0&":
/*!********************************************************************!*\
  !*** ./src/js/components/PopUp.vue?vue&type=template&id=d5651ca0& ***!
  \********************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PopUp_vue_vue_type_template_id_d5651ca0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./PopUp.vue?vue&type=template&id=d5651ca0& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/PopUp.vue?vue&type=template&id=d5651ca0&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PopUp_vue_vue_type_template_id_d5651ca0___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PopUp_vue_vue_type_template_id_d5651ca0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/components/SkateTestEquivalency/DisciplineForm.vue":
/*!*******************************************************************!*\
  !*** ./src/js/components/SkateTestEquivalency/DisciplineForm.vue ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DisciplineForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DisciplineForm.vue?vue&type=script&lang=ts& */ "./src/js/components/SkateTestEquivalency/DisciplineForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _DisciplineForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/SkateTestEquivalency/DisciplineForm.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/SkateTestEquivalency/DisciplineForm.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************!*\
  !*** ./src/js/components/SkateTestEquivalency/DisciplineForm.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_DisciplineForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./DisciplineForm.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/SkateTestEquivalency/DisciplineForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_DisciplineForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue":
/*!*************************************************************************!*\
  !*** ./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SkateTestEquivalency_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SkateTestEquivalency.vue?vue&type=script&lang=ts& */ "./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _SkateTestEquivalency_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue?vue&type=script&lang=ts&":
/*!**************************************************************************************************!*\
  !*** ./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue?vue&type=script&lang=ts& ***!
  \**************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SkateTestEquivalency_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./SkateTestEquivalency.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/SkateTestEquivalency/SkateTestEquivalency.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SkateTestEquivalency_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/StepsIndicator.vue":
/*!**********************************************!*\
  !*** ./src/js/components/StepsIndicator.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _StepsIndicator_vue_vue_type_template_id_055cc274___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StepsIndicator.vue?vue&type=template&id=055cc274& */ "./src/js/components/StepsIndicator.vue?vue&type=template&id=055cc274&");
/* harmony import */ var _StepsIndicator_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StepsIndicator.vue?vue&type=script&lang=ts& */ "./src/js/components/StepsIndicator.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _StepsIndicator_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _StepsIndicator_vue_vue_type_template_id_055cc274___WEBPACK_IMPORTED_MODULE_0__["render"],
  _StepsIndicator_vue_vue_type_template_id_055cc274___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/StepsIndicator.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/StepsIndicator.vue?vue&type=script&lang=ts&":
/*!***********************************************************************!*\
  !*** ./src/js/components/StepsIndicator.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StepsIndicator_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/ts-loader??ref--5!../../../node_modules/vue-loader/lib??vue-loader-options!./StepsIndicator.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/StepsIndicator.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StepsIndicator_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/StepsIndicator.vue?vue&type=template&id=055cc274&":
/*!*****************************************************************************!*\
  !*** ./src/js/components/StepsIndicator.vue?vue&type=template&id=055cc274& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StepsIndicator_vue_vue_type_template_id_055cc274___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./StepsIndicator.vue?vue&type=template&id=055cc274& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/StepsIndicator.vue?vue&type=template&id=055cc274&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StepsIndicator_vue_vue_type_template_id_055cc274___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StepsIndicator_vue_vue_type_template_id_055cc274___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/config/AppConfig.ts":
/*!************************************!*\
  !*** ./src/js/config/AppConfig.ts ***!
  \************************************/
/*! exports provided: URL_CONFIG, PracticeIceConfig, CREDIT_CARD_GAP_SEPARATOR, DATE_INPUT_GAP_SEPARATOR, SKIP_VALIDATION, ENTITY_CHECK_IN_DEBUG, AUTOLOAD_ENTITY_CHECK_IN_INDEX, COMPETITION_MANAGEMENT_COOKIE_NAME, SERIES_REGISTRATION_COOKIE_NAME, TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME, TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME, COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME, COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME, SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "URL_CONFIG", function() { return URL_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PracticeIceConfig", function() { return PracticeIceConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CREDIT_CARD_GAP_SEPARATOR", function() { return CREDIT_CARD_GAP_SEPARATOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DATE_INPUT_GAP_SEPARATOR", function() { return DATE_INPUT_GAP_SEPARATOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SKIP_VALIDATION", function() { return SKIP_VALIDATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ENTITY_CHECK_IN_DEBUG", function() { return ENTITY_CHECK_IN_DEBUG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTOLOAD_ENTITY_CHECK_IN_INDEX", function() { return AUTOLOAD_ENTITY_CHECK_IN_INDEX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPETITION_MANAGEMENT_COOKIE_NAME", function() { return COMPETITION_MANAGEMENT_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SERIES_REGISTRATION_COOKIE_NAME", function() { return SERIES_REGISTRATION_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME", function() { return TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME", function() { return TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME", function() { return COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME", function() { return COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME", function() { return SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME; });
var URL_CONFIG = {
    login: '/Account/CheckLogin',
    getSkaterComps: '/EMS/UpcomingCompsSkater',
    getCompetitionList: '/api/competitions'
};
var PracticeIceConfig = {
    allow_all_dates_filter: false
};
var CREDIT_CARD_GAP_SEPARATOR = ' ';
var DATE_INPUT_GAP_SEPARATOR = '/';
/**
 * Whether to bypass validation for forms.  Used for development
 *
 * @note: not all forms are tied to this value as of this writing and may still validate even when this is true
 */
var SKIP_VALIDATION = false;
/**
 * Enable debug mode for entity check-in:
 *
 * 1. Shows all subpage items on entity check-in index
 */
var ENTITY_CHECK_IN_DEBUG = false;
/**
 * Start check-in with an entity active.
 *
 * Set to a number to load the appropriate entity.
 * Set to false or undefined to prevent autoload.
 */
var AUTOLOAD_ENTITY_CHECK_IN_INDEX = false;
/**
 * Name of cookie from which active Competition Management Competition ID can be read.
 *
 * False if cookie is not being used.
 */
var COMPETITION_MANAGEMENT_COOKIE_NAME = false; // 'competition_management_active_competition_id';
/**
 * Name of cookie from which active Series Registration Series ID can be read
 */
var SERIES_REGISTRATION_COOKIE_NAME = 'series_registration_series_id';
/**
 * Name of cookie from which active Team Registration Team ID can be read
 */
var TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME = 'team_competition_registration_team_id';
/**
 * Name of cookie from which active Team Registration Competition ID can be read
 */
var TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME = 'team_competition_registration_competition_id';
/**
 * Name of cookie that tracks the active competition ID within the Competition Portal
 */
var COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME = 'competition_portal_competition_id';
/**
 * Name of cookie that tracks the active team ID within the Competition Portal
 */
var COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME = 'competition_portal_team_id';
/**
 * Name of cookie that tracks the active team ID within Series Registration
 */
var SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME = 'series_registration_team_id';


/***/ }),

/***/ "./src/js/create-account.ts":
/*!**********************************!*\
  !*** ./src/js/create-account.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var es6_promise_auto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! es6-promise/auto */ "./node_modules/es6-promise/auto.js");
/* harmony import */ var es6_promise_auto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(es6_promise_auto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vendor_modernizr_custom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vendor/modernizr.custom */ "./src/js/vendor/modernizr.custom.js");
/* harmony import */ var _vendor_modernizr_custom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_vendor_modernizr_custom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _pages_CreateAccount_CreateAccount_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/CreateAccount/CreateAccount.vue */ "./src/js/pages/CreateAccount/CreateAccount.vue");
/* harmony import */ var _components_StepsIndicator_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/StepsIndicator.vue */ "./src/js/components/StepsIndicator.vue");
/* harmony import */ var _components_PopUp_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/PopUp.vue */ "./src/js/components/PopUp.vue");
/* harmony import */ var _components_DateInput_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/DateInput.vue */ "./src/js/components/DateInput.vue");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _store_CreateAccount__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./store/CreateAccount */ "./src/js/store/CreateAccount/index.ts");









vue__WEBPACK_IMPORTED_MODULE_2__["default"].component('popup', _components_PopUp_vue__WEBPACK_IMPORTED_MODULE_5__["default"]);
vue__WEBPACK_IMPORTED_MODULE_2__["default"].component('date-input', _components_DateInput_vue__WEBPACK_IMPORTED_MODULE_6__["default"]);
vue__WEBPACK_IMPORTED_MODULE_2__["default"].component('steps-indicator', _components_StepsIndicator_vue__WEBPACK_IMPORTED_MODULE_4__["default"]);
axios__WEBPACK_IMPORTED_MODULE_7___default.a.defaults.headers.common = {
    "X-Requested-With": "XMLHttpRequest",
};
new vue__WEBPACK_IMPORTED_MODULE_2__["default"]({
    el: "#app",
    store: _store_CreateAccount__WEBPACK_IMPORTED_MODULE_8__["default"],
    components: {
        'create-account': _pages_CreateAccount_CreateAccount_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    }
});


/***/ }),

/***/ "./src/js/mixins/AddressFormMixin.ts":
/*!*******************************************!*\
  !*** ./src/js/mixins/AddressFormMixin.ts ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _FormMixin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FormMixin */ "./src/js/mixins/FormMixin.ts");
/* harmony import */ var _models_CreateAccount_AddressFormState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/CreateAccount/AddressFormState */ "./src/js/models/CreateAccount/AddressFormState.ts");
/* harmony import */ var _models_CreateAccount_AddressFormValidator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/CreateAccount/AddressFormValidator */ "./src/js/models/CreateAccount/AddressFormValidator.ts");




/* harmony default export */ __webpack_exports__["default"] = (Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__["default"])(_FormMixin__WEBPACK_IMPORTED_MODULE_1__["default"]).extend({
    /**
     * The component relies on country, state, and province options existing in
     * FormOptionsState.  As of this writing, this is handled by parent components
     */
    created: function () {
        //
    },
    data: function () {
        return {
            form_data: new _models_CreateAccount_AddressFormState__WEBPACK_IMPORTED_MODULE_2__["AddressFormState"](),
            validator_class: _models_CreateAccount_AddressFormValidator__WEBPACK_IMPORTED_MODULE_3__["AddressFormValidator"]
        };
    },
    methods: {
        complete: function () {
            this.submit_attempt = true;
            if (!this.valid) {
                return;
            }
            this.$emit('complete', this.form_data.export());
        },
    },
    computed: {
        /**
         * Whether the user has selected USA as the country
         */
        is_usa: function () {
            return this.form_data.is_usa;
        },
        /**
         * Whether the user has selected Canada as the country
         */
        is_canada: function () {
            return this.form_data.is_canada;
        },
        /**
         * Whether zip code input is required.
         */
        zip_required: function () {
            return this.is_usa || this.is_canada;
        },
        /**
         * Options for form inputs
         */
        form_options: function () {
            return {
                states: this.$store.getters['form_options/states'],
                countries: this.$store.getters['form_options/countries'],
                provinces: this.$store.getters['form_options/provinces'],
            };
        }
    }
}));


/***/ }),

/***/ "./src/js/mixins/FormMixin.ts":
/*!************************************!*\
  !*** ./src/js/mixins/FormMixin.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_FormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/FormValidator */ "./src/js/models/FormValidator.ts");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _models_FormState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/FormState */ "./src/js/models/FormState.ts");



/**
 * Mixin to be used as a foundation for a form.
 * Include form state data
 * Run validator against form state
 * Provide field class and message information based on validation state
 *
 */
/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_1__["default"].extend({
    props: {
        /**
         * External error provided by parent
         */
        external_error: {
            type: String,
            required: false
        },
        /**
         * Whether parent is submitting emitted data
         */
        submitting: {
            type: Boolean,
            required: false
        }
    },
    data: function () {
        return {
            /**
             * The validator to use against the form data
             */
            validator_class: _models_FormValidator__WEBPACK_IMPORTED_MODULE_0__["FormValidator"],
            /**
             * State form data class
             */
            form_data: new _models_FormState__WEBPACK_IMPORTED_MODULE_2__["FormState"](),
            /**
             * Whether a submission attempt has been made
             */
            submit_attempt: false
        };
    },
    methods: {
        /**
         * Class to apply to a field.  Error and success states based on validation state
         */
        fieldClass: function (field_name) {
            if (!this.submit_attempt) {
                return;
            }
            if (field_name in this.errors) {
                return "has-error";
            }
            if (this.form_data[field_name]) {
                return "has-success";
            }
        },
        /**
         * Message to display for a field.  Based on validation state
         */
        fieldMessage: function (field_name) {
            if (!this.submit_attempt) {
                return;
            }
            if (field_name in this.messages) {
                return this.messages[field_name][0];
            }
        },
    },
    computed: {
        /**
         * The validation result on the form
         */
        validation_result: function () {
            return new this.validator_class(this.form_data).validate();
        },
        /**
         * Validation errors on the form
         */
        errors: function () {
            return this.validation_result.errors;
        },
        /**
         * Validation messages on the form
         */
        messages: function () {
            return this.validation_result.messages;
        },
        /**
         * Whether the form is valid
         */
        valid: function () {
            return Object.keys(this.errors).length === 0;
        },
    },
    watch: {
        form_data: {
            handler: function () {
                this.$emit('changed');
            },
            deep: true
        }
    }
}));


/***/ }),

/***/ "./src/js/mixins/HasDataDependencies.ts":
/*!**********************************************!*\
  !*** ./src/js/mixins/HasDataDependencies.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    /**
     * Handle data loading and loading state-related variables upon component creation
     */
    created: function () {
        var _this = this;
        this.initLoadingTimeout();
        this.preDataLoad()
            .then(function () {
            _this.loadData().catch(function () {
                _this.load_error = true;
            });
        });
    },
    data: function () {
        return {
            /**
             * Dependencies for component loading
             */
            dependencies: {},
            /**
             * Whether there was an error loading component dependencies
             */
            load_error: false,
            /**
             * Timeout after which to display a loading message if data is not yet loaded
             */
            loading_timeout: false,
        };
    },
    methods: {
        /**
         * Start the loading timeout.  Log value after expiration
         */
        initLoadingTimeout: function () {
            var _this = this;
            setTimeout(function () {
                _this.loading_timeout = true;
            }, 200);
        },
        /**
         * Load dependencies
         */
        loadData: function () {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        },
        /**
         * Action to take prior to data load attempt
         */
        preDataLoad: function () {
            return new Promise(function (resolve) {
                resolve();
            });
        }
    },
    computed: {
        /**
         * Whether the component data is fully loaded.
         */
        loaded: function () {
            for (var i in this.dependencies) {
                if (this.dependencies.hasOwnProperty(i)) {
                    var obj = this.dependencies[i];
                    if (obj !== true) {
                        return false;
                    }
                }
            }
            return true;
        },
        /**
         * Whether the component successfully loaded
         */
        component_loaded: function () {
            return this.loaded && !this.load_error;
        }
    }
}));


/***/ }),

/***/ "./src/js/models/CreateAccount/AddressFormState.ts":
/*!*********************************************************!*\
  !*** ./src/js/models/CreateAccount/AddressFormState.ts ***!
  \*********************************************************/
/*! exports provided: AddressFormState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddressFormState", function() { return AddressFormState; });
/* harmony import */ var _FormState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormState */ "./src/js/models/FormState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Class to track state of Address Form data
 */
var AddressFormState = /** @class */ (function (_super) {
    __extends(AddressFormState, _super);
    function AddressFormState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.country = null;
        _this.street = null;
        _this.street_2 = null;
        _this.city = null;
        _this.state = null;
        _this.province = null;
        _this.zip = null;
        return _this;
    }
    Object.defineProperty(AddressFormState.prototype, "is_usa", {
        /**
         * Whether the selected country is USA.  Default to true
         */
        get: function () {
            return !this.country || this.country.is_usa;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddressFormState.prototype, "is_canada", {
        /**
         * Whether the selected country is Canada. Only true when a country is selected and it's Canada
         */
        get: function () {
            return this.country !== null && this.country.is_canada;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Export the form data state.
     * Flatten FormOptions to their value attributes
     */
    AddressFormState.prototype.export = function () {
        return {
            country: this.country ? this.country.value : '',
            street: this.street ? this.street : '',
            street_2: this.street_2 ? this.street_2 : '',
            city: this.city ? this.city : '',
            state: this.is_usa && this.state ? this.state.value : '',
            province: this.is_canada && this.province ? this.province.value : '',
            zip: this.zip ? this.zip : ''
        };
    };
    return AddressFormState;
}(_FormState__WEBPACK_IMPORTED_MODULE_0__["FormState"]));



/***/ }),

/***/ "./src/js/models/CreateAccount/AddressFormValidator.ts":
/*!*************************************************************!*\
  !*** ./src/js/models/CreateAccount/AddressFormValidator.ts ***!
  \*************************************************************/
/*! exports provided: AddressFormValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddressFormValidator", function() { return AddressFormValidator; });
/* harmony import */ var _FormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormValidator */ "./src/js/models/FormValidator.ts");
/* harmony import */ var _ValidationFunctions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ValidationFunctions */ "./src/js/models/ValidationFunctions.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * Validator to be used with AddressForms
 */
var AddressFormValidator = /** @class */ (function (_super) {
    __extends(AddressFormValidator, _super);
    function AddressFormValidator(form_data) {
        var _this = _super.call(this, form_data) || this;
        _this.rules = {
            country: ["required"],
            street: ["required"],
            city: ["required"]
        };
        return _this;
    }
    /**
     * Override base validate method to add conditional rules
     */
    AddressFormValidator.prototype.validate = function () {
        var result = _super.prototype.validate.call(this);
        if (!this.validateState()) {
            this.ensureValidationResultFieldPresence('state', result);
            result.errors.state.push('required');
            result.messages.state.push('This field is required');
        }
        if (!this.validateProvince()) {
            this.ensureValidationResultFieldPresence('province', result);
            result.errors.province.push('required');
            result.messages.province.push('This field is required');
        }
        if (!this.validateZipRequired()) {
            this.ensureValidationResultFieldPresence('zip', result);
            result.errors.zip.push('required');
            result.messages.zip.push('This field is required');
        }
        if (!this.validateZipFormat()) {
            this.ensureValidationResultFieldPresence('zip', result);
            result.errors.zip.push('format');
            var code_name = this.form_data.is_canada ? "postal" : "zip";
            result.messages.zip.push('Enter a valid ' + code_name + ' code');
        }
        return result;
    };
    /**
     * Test validity of state field
     * If country is USA, required.  Else valid
     */
    AddressFormValidator.prototype.validateState = function () {
        if (this.form_data.is_usa) {
            return this.validateRule('required', this.form_data.state);
        }
        return true;
    };
    /**
     * Test validity of province field
     * If country is Canada, required.  Else valid
     */
    AddressFormValidator.prototype.validateProvince = function () {
        if (this.form_data.is_canada) {
            return this.validateRule('required', this.form_data.province);
        }
        return true;
    };
    /**
     * test validity of the zip/postal code format.
     * If country is USA, validate according to US formatting rules
     * If country is Canada, validate according to Canada formatting rules
     * Otherwise, format is treated as valid
     */
    AddressFormValidator.prototype.validateZipFormat = function () {
        if (this.form_data.is_usa) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_1__["validateUSAZipCode"])(this.form_data.zip);
        }
        if (this.form_data.is_canada) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_1__["validateCanadaPostalCode"])(this.form_data.zip);
        }
        return true;
    };
    /**
     * Test validity of zip code field presence.
     * If US or Canada, field is required.
     * Otherwise, field is optional
     */
    AddressFormValidator.prototype.validateZipRequired = function () {
        if (this.form_data.is_usa || this.form_data.is_canada) {
            return this.validateRule('required', this.form_data.zip);
        }
        return true;
    };
    return AddressFormValidator;
}(_FormValidator__WEBPACK_IMPORTED_MODULE_0__["FormValidator"]));



/***/ }),

/***/ "./src/js/models/CreateAccount/EmergencyContactFormValidator.ts":
/*!**********************************************************************!*\
  !*** ./src/js/models/CreateAccount/EmergencyContactFormValidator.ts ***!
  \**********************************************************************/
/*! exports provided: EmergencyContactFormValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmergencyContactFormValidator", function() { return EmergencyContactFormValidator; });
/* harmony import */ var _FormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormValidator */ "./src/js/models/FormValidator.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Validator to be used with Emergency Contact Forms
 * @note: Currently no validation in place.  Model created to maintain dependency conventions
 */
var EmergencyContactFormValidator = /** @class */ (function (_super) {
    __extends(EmergencyContactFormValidator, _super);
    function EmergencyContactFormValidator(form_data) {
        return _super.call(this, form_data) || this;
    }
    return EmergencyContactFormValidator;
}(_FormValidator__WEBPACK_IMPORTED_MODULE_0__["FormValidator"]));



/***/ }),

/***/ "./src/js/models/CreateAccount/FederationInfoFormState.ts":
/*!****************************************************************!*\
  !*** ./src/js/models/CreateAccount/FederationInfoFormState.ts ***!
  \****************************************************************/
/*! exports provided: FederationInfoFormState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FederationInfoFormState", function() { return FederationInfoFormState; });
/* harmony import */ var _FormState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormState */ "./src/js/models/FormState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Class to track state of Federation information Form data
 */
var FederationInfoFormState = /** @class */ (function (_super) {
    __extends(FederationInfoFormState, _super);
    function FederationInfoFormState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.user_type = [];
        _this.federation = null;
        return _this;
    }
    /**
     * Export the form data state.
     */
    FederationInfoFormState.prototype.export = function () {
        return {
            federation: this.federation ? this.federation.value : "",
            user_type: this.user_type
        };
    };
    return FederationInfoFormState;
}(_FormState__WEBPACK_IMPORTED_MODULE_0__["FormState"]));



/***/ }),

/***/ "./src/js/models/CreateAccount/FederationInfoFormValidator.ts":
/*!********************************************************************!*\
  !*** ./src/js/models/CreateAccount/FederationInfoFormValidator.ts ***!
  \********************************************************************/
/*! exports provided: FederationInfoFormValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FederationInfoFormValidator", function() { return FederationInfoFormValidator; });
/* harmony import */ var _FormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormValidator */ "./src/js/models/FormValidator.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Validator to be used with Federation Info Forms
 */
var FederationInfoFormValidator = /** @class */ (function (_super) {
    __extends(FederationInfoFormValidator, _super);
    function FederationInfoFormValidator(form_data) {
        var _this = _super.call(this, form_data) || this;
        _this.rules = {
            federation: ["required"]
        };
        return _this;
    }
    /**
     * Override base validation to provide combined message for user type checkgroup
     */
    FederationInfoFormValidator.prototype.validate = function () {
        var result = _super.prototype.validate.call(this);
        if (!this.validateUserType()) {
            this.ensureValidationResultFieldPresence('user_type', result);
            result.errors.user_type.push('required');
            result.messages.user_type.push('Select at least one of the above');
        }
        return result;
    };
    /**
     * Validate user type checkgroup field
     */
    FederationInfoFormValidator.prototype.validateUserType = function () {
        return this.validateRule('required', this.form_data.user_type);
    };
    return FederationInfoFormValidator;
}(_FormValidator__WEBPACK_IMPORTED_MODULE_0__["FormValidator"]));



/***/ }),

/***/ "./src/js/models/CreateAccount/PasswordFormState.ts":
/*!**********************************************************!*\
  !*** ./src/js/models/CreateAccount/PasswordFormState.ts ***!
  \**********************************************************/
/*! exports provided: PasswordFormState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PasswordFormState", function() { return PasswordFormState; });
/* harmony import */ var _FormState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormState */ "./src/js/models/FormState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Class to track state of Password Form data
 */
var PasswordFormState = /** @class */ (function (_super) {
    __extends(PasswordFormState, _super);
    function PasswordFormState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.password = null;
        _this.password_confirm = null;
        return _this;
    }
    /**
     * Export the form data state.
     */
    PasswordFormState.prototype.export = function () {
        return {
            password: this.password ? this.password : '',
            password_confirm: this.password_confirm ? this.password_confirm : '',
        };
    };
    return PasswordFormState;
}(_FormState__WEBPACK_IMPORTED_MODULE_0__["FormState"]));



/***/ }),

/***/ "./src/js/models/CreateAccount/PasswordFormValidator.ts":
/*!**************************************************************!*\
  !*** ./src/js/models/CreateAccount/PasswordFormValidator.ts ***!
  \**************************************************************/
/*! exports provided: PasswordFormValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PasswordFormValidator", function() { return PasswordFormValidator; });
/* harmony import */ var _FormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormValidator */ "./src/js/models/FormValidator.ts");
/* harmony import */ var _ValidationRules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ValidationRules */ "./src/js/models/ValidationRules.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * Validator to be used with Password Forms
 */
var PasswordFormValidator = /** @class */ (function (_super) {
    __extends(PasswordFormValidator, _super);
    function PasswordFormValidator(form_data) {
        var _this = _super.call(this, form_data) || this;
        _this.rules = {
            password: ["required", new _ValidationRules__WEBPACK_IMPORTED_MODULE_1__["MinLengthValidationRule"](6)],
            password_confirm: ["required", new _ValidationRules__WEBPACK_IMPORTED_MODULE_1__["EqualValidationRule"]('password')],
        };
        _this.messages = {
            "required": "This field is required",
            "equal": "Passwords do not match",
            "min_length": "Password is not long enough"
        };
        return _this;
    }
    return PasswordFormValidator;
}(_FormValidator__WEBPACK_IMPORTED_MODULE_0__["FormValidator"]));



/***/ }),

/***/ "./src/js/models/CreateAccount/PersonalInformationFormState.ts":
/*!*********************************************************************!*\
  !*** ./src/js/models/CreateAccount/PersonalInformationFormState.ts ***!
  \*********************************************************************/
/*! exports provided: PersonalInformationFormState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersonalInformationFormState", function() { return PersonalInformationFormState; });
/* harmony import */ var _FormState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormState */ "./src/js/models/FormState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Class to track state of Personal Information Form data
 */
var PersonalInformationFormState = /** @class */ (function (_super) {
    __extends(PersonalInformationFormState, _super);
    function PersonalInformationFormState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.first_name = null;
        _this.last_name = null;
        _this.date_of_birth = null;
        _this.gender = null;
        _this.phone = null;
        _this.email = null;
        _this.captcha_value = "";
        return _this;
    }
    /**
     * Export the form data state.
     */
    PersonalInformationFormState.prototype.export = function () {
        return {
            first_name: this.first_name ? this.first_name : '',
            last_name: this.last_name ? this.last_name : '',
            date_of_birth: this.date_of_birth ? this.date_of_birth : '',
            gender: this.gender ? this.gender : '',
            phone: this.phone ? this.phone : '',
            email: this.email ? this.email : '',
            captcha_value: this.captcha_value
        };
    };
    return PersonalInformationFormState;
}(_FormState__WEBPACK_IMPORTED_MODULE_0__["FormState"]));



/***/ }),

/***/ "./src/js/models/CreateAccount/PersonalInformationFormValidator.ts":
/*!*************************************************************************!*\
  !*** ./src/js/models/CreateAccount/PersonalInformationFormValidator.ts ***!
  \*************************************************************************/
/*! exports provided: PersonalInformationFormValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersonalInformationFormValidator", function() { return PersonalInformationFormValidator; });
/* harmony import */ var _FormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormValidator */ "./src/js/models/FormValidator.ts");
/* harmony import */ var _config_AppConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/AppConfig */ "./src/js/config/AppConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * Validator to be used with Personal Information Forms
 */
var PersonalInformationFormValidator = /** @class */ (function (_super) {
    __extends(PersonalInformationFormValidator, _super);
    function PersonalInformationFormValidator(form_data) {
        var _this = _super.call(this, form_data) || this;
        _this.rules = {
            first_name: ['required'],
            last_name: ['required'],
            date_of_birth: ['required', 'date_formatted', 'date_not_future'],
            gender: ['required'],
            phone: ['required'],
            email: ['required', 'email'],
            captcha_value: ['required']
        };
        _this.messages = {
            required: "This field is required",
            email: "Enter a valid email address",
            date_formatted: "Enter a valid date in the format mm/dd/yyyy",
            date_not_future: "Enter a date that's not in the future",
        };
        if (_config_AppConfig__WEBPACK_IMPORTED_MODULE_1__["SKIP_VALIDATION"]) {
            _this.rules = {};
        }
        return _this;
    }
    return PersonalInformationFormValidator;
}(_FormValidator__WEBPACK_IMPORTED_MODULE_0__["FormValidator"]));



/***/ }),

/***/ "./src/js/models/FormState.ts":
/*!************************************!*\
  !*** ./src/js/models/FormState.ts ***!
  \************************************/
/*! exports provided: FormState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormState", function() { return FormState; });
/**
 * Baseline class to track state of abstract Form data
 */
var FormState = /** @class */ (function () {
    function FormState() {
    }
    return FormState;
}());



/***/ }),

/***/ "./src/js/models/FormValidator.ts":
/*!****************************************!*\
  !*** ./src/js/models/FormValidator.ts ***!
  \****************************************/
/*! exports provided: FormValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormValidator", function() { return FormValidator; });
/* harmony import */ var _ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ValidationFunctions */ "./src/js/models/ValidationFunctions.ts");

var FormValidator = /** @class */ (function () {
    function FormValidator(form_data) {
        this.rules = {};
        this.messages = {
            "required": "This field is required"
        };
        this.form_data = form_data;
    }
    FormValidator.prototype.validate = function () {
        var errors = {};
        var messages = {};
        for (var field in this.rules) {
            var field_rules = this.rules[field];
            for (var i = 0; i < field_rules.length; i++) {
                var field_rule = field_rules[i].toString();
                var formDatum = this.form_data[field];
                if (!this.validateRule(field_rule, formDatum)) {
                    this.addError(errors, field, field_rule);
                    this.addMessage(messages, field, field_rule);
                }
            }
        }
        return {
            errors: errors,
            messages: messages
        };
    };
    FormValidator.prototype.validateRule = function (rule_params, value) {
        var split = rule_params.split(':');
        var rule = split[0];
        var attributes = split[1];
        /**
         * If rule is equal, get the value of the field from data for comparison
         */
        if (rule === "equal") {
            attributes = this.form_data[attributes];
        }
        return FormValidator.validators[rule](value, attributes);
    };
    FormValidator.prototype.addMessage = function (messages, field, field_rule) {
        var split = field_rule.split(':');
        var rule = split[0];
        var attributes = split[1];
        if (!messages.hasOwnProperty(field)) {
            messages[field] = [];
        }
        var message_def = this.messages[rule];
        var message = typeof message_def === 'string' ? message_def : message_def(attributes);
        messages[field].push(message);
    };
    FormValidator.prototype.addError = function (errors, field, field_rule) {
        var split = field_rule.split(':');
        var rule = split[0];
        if (!errors.hasOwnProperty(field)) {
            errors[field] = [];
        }
        errors[field].push(rule);
    };
    /**
     * Ensure a validation result has the necessary foundation for a field's errors and messages
     * If errors and messages properties don't contain a key for a field, add baseline
     */
    FormValidator.prototype.ensureValidationResultFieldPresence = function (field_key, result) {
        if (!result.errors[field_key]) {
            result.errors[field_key] = [];
        }
        if (!result.messages[field_key]) {
            result.messages[field_key] = [];
        }
    };
    FormValidator.validators = {
        required: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateRequired"])(value, false);
        },
        /**
         *
         * Right now we're allowing a lot of input through with the goal of not displaying errors for fringe case zip codes
         */
        zip: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateMinLength"])(value, 5) && Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateMaxLength"])(value, 10);
            // return validateZipCode(value);
        },
        cvc: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateCVC"])(value);
        },
        credit_card_number: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateCreditCardNumber"])(value);
        },
        integer: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateInteger"])(value);
        },
        max: function (value, limit) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateMax"])(value, limit);
        },
        email: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateEmail"])(value);
        },
        nullable_email: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateNullableEmail"])(value);
        },
        equal: function (value, match_field) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateEqual"])(value, match_field);
        },
        min_length: function (value, limit) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateMinLength"])(value, limit);
        },
        date_formatted: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateDateFormatted"])(value);
        },
        date_not_future: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateDateNotFuture"])(value);
        },
        confirmed: function (value) {
            return Object(_ValidationFunctions__WEBPACK_IMPORTED_MODULE_0__["validateConfirmed"])(value);
        }
    };
    return FormValidator;
}());



/***/ }),

/***/ "./src/js/models/Forms/EmergencyContactFormState.ts":
/*!**********************************************************!*\
  !*** ./src/js/models/Forms/EmergencyContactFormState.ts ***!
  \**********************************************************/
/*! exports provided: EmergencyContactFormState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmergencyContactFormState", function() { return EmergencyContactFormState; });
/* harmony import */ var _FormState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormState */ "./src/js/models/FormState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Class to track state of Emergency Contact Form data
 */
var EmergencyContactFormState = /** @class */ (function (_super) {
    __extends(EmergencyContactFormState, _super);
    function EmergencyContactFormState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = null;
        _this.relationship = null;
        _this.phone = null;
        return _this;
    }
    /**
     * Export the form data state.
     */
    EmergencyContactFormState.prototype.export = function () {
        return {
            name: this.name ? this.name : '',
            relationship: this.relationship ? this.relationship : '',
            phone: this.phone ? this.phone : ''
        };
    };
    return EmergencyContactFormState;
}(_FormState__WEBPACK_IMPORTED_MODULE_0__["FormState"]));



/***/ }),

/***/ "./src/js/models/SkateTestEquivalency/SkateTestDisciplineFormState.ts":
/*!****************************************************************************!*\
  !*** ./src/js/models/SkateTestEquivalency/SkateTestDisciplineFormState.ts ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FormState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormState */ "./src/js/models/FormState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

/**
 * Class to track state of Skate Test Discipline Form data
 */
var SkateTestDisciplineFormState = /** @class */ (function (_super) {
    __extends(SkateTestDisciplineFormState, _super);
    function SkateTestDisciplineFormState(default_club) {
        if (default_club === void 0) { default_club = true; }
        var _this = _super.call(this) || this;
        _this.test = null;
        _this.club = null;
        _this.club_id = null;
        _this.date = null;
        if (default_club) {
            _this.club = "Foreign";
        }
        return _this;
    }
    /**
     * Export the form data state.
     * Flatten FormOptions
     */
    SkateTestDisciplineFormState.prototype.export = function () {
        return {
            test: this.test ? this.test : { label: "None", value: null, level_id: 0 },
            club: this.club ? this.club : '',
            date: this.date ? this.date : '',
            club_id: this.club_id ? this.club_id : null,
        };
    };
    SkateTestDisciplineFormState.prototype.import = function (data) {
        if (!data) {
            return;
        }
        this.test = __assign({}, data.test);
        this.club = data.club;
        this.date = data.date;
    };
    return SkateTestDisciplineFormState;
}(_FormState__WEBPACK_IMPORTED_MODULE_0__["FormState"]));
/* harmony default export */ __webpack_exports__["default"] = (SkateTestDisciplineFormState);


/***/ }),

/***/ "./src/js/models/SkateTestEquivalency/SkateTestDisciplineFormValidator.ts":
/*!********************************************************************************!*\
  !*** ./src/js/models/SkateTestEquivalency/SkateTestDisciplineFormValidator.ts ***!
  \********************************************************************************/
/*! exports provided: SkateTestDisciplineFormValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkateTestDisciplineFormValidator", function() { return SkateTestDisciplineFormValidator; });
/* harmony import */ var _FormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../FormValidator */ "./src/js/models/FormValidator.ts");
/* harmony import */ var _config_AppConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/AppConfig */ "./src/js/config/AppConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * Validator to be used with Skate Test Discipline Forms
 */
var SkateTestDisciplineFormValidator = /** @class */ (function (_super) {
    __extends(SkateTestDisciplineFormValidator, _super);
    function SkateTestDisciplineFormValidator(form_data) {
        var _this = _super.call(this, form_data) || this;
        _this.rules = {
            test: ['required'],
            club: ['required'],
            date: ['required', 'date_formatted', 'date_not_future']
        };
        _this.messages = {
            required: "This field is required",
            date_formatted: "Enter a valid date in the format mm/dd/yyyy",
            date_not_future: "Enter a date that's not in the future",
        };
        if (_config_AppConfig__WEBPACK_IMPORTED_MODULE_1__["SKIP_VALIDATION"]) {
            _this.rules = {};
        }
        return _this;
    }
    return SkateTestDisciplineFormValidator;
}(_FormValidator__WEBPACK_IMPORTED_MODULE_0__["FormValidator"]));



/***/ }),

/***/ "./src/js/models/ValidationFunctions.ts":
/*!**********************************************!*\
  !*** ./src/js/models/ValidationFunctions.ts ***!
  \**********************************************/
/*! exports provided: validateRequired, validateMaxLength, validateMinLength, validateEmail, validateNullableEmail, validateUSAZipCode, validateCanadaPostalCode, validateDateFormatted, validateDateNotFuture, validateZipCode, validateCVC, validateCreditCardNumber, validateExpiration, validateInteger, validateMax, validateEqual, validateConfirmed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateRequired", function() { return validateRequired; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateMaxLength", function() { return validateMaxLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateMinLength", function() { return validateMinLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateEmail", function() { return validateEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateNullableEmail", function() { return validateNullableEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateUSAZipCode", function() { return validateUSAZipCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateCanadaPostalCode", function() { return validateCanadaPostalCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateDateFormatted", function() { return validateDateFormatted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateDateNotFuture", function() { return validateDateNotFuture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateZipCode", function() { return validateZipCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateCVC", function() { return validateCVC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateCreditCardNumber", function() { return validateCreditCardNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateExpiration", function() { return validateExpiration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateInteger", function() { return validateInteger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateMax", function() { return validateMax; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateEqual", function() { return validateEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateConfirmed", function() { return validateConfirmed; });
/* harmony import */ var card_validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! card-validator */ "./node_modules/card-validator/index.js");
/* harmony import */ var card_validator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(card_validator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_AppConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/AppConfig */ "./src/js/config/AppConfig.ts");


/**
 * VALIDATION HELPERS
 */
function validateRequired(field, invalidateZero) {
    if (field === undefined || field === null) {
        return false;
    }
    if (field === "0" && invalidateZero) {
        return false;
    }
    return !!String(field).trim().length;
}
function validateMaxLength(field, length) {
    if (field === undefined || field === null) {
        return false;
    }
    return !!(String(field).trim().length <= length);
}
function validateMinLength(field, length) {
    if (field === undefined || field === null) {
        return false;
    }
    return !!(String(field).trim().length >= length);
}
/**
 * Rudimentary email validation
 * Match [anything] @ [anything] . [anything]
 */
function validateEmail(field) {
    if (field === undefined || field === null) {
        return false;
    }
    return !!String(field).match(/.+@.+\..+/i);
}
/**
 * Validate an email's format if it exists.
 * falsy field values pass validation
 */
function validateNullableEmail(field) {
    if (field === undefined || field === null || field === "") {
        return true;
    }
    return validateEmail(field);
}
/**
 * Check that the value, if present, matches one of USA postal code formats (where X is numeric):
 *
 * XXXXX
 * XXXXX-XXXX
 */
function validateUSAZipCode(field) {
    // empty fields pass validation
    if (field === undefined || field === null) {
        return true;
    }
    var regex = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    return regex.test(field);
}
/**
 * Check that the value, if present, matches CAN postal code formats (where X is alpha-numeric):
 *
 * XXXXXX
 * XXX XXX
 */
function validateCanadaPostalCode(field) {
    // empty fields pass validation
    if (field === undefined || field === null) {
        return true;
    }
    var regex = new RegExp(/(^[A-Za-z0-9]{6}$)|(^[A-Za-z0-9]{3}\s[A-Za-z0-9]{3}$)/);
    return regex.test(field);
}
/**
 * Validate a date is formatted in MM/DD/YYYY format
 */
function validateDateFormatted(field) {
    if (field === undefined || field === null || field === '') {
        return true;
    }
    var regex_string = "[0-9]{2}\\" + _config_AppConfig__WEBPACK_IMPORTED_MODULE_1__["DATE_INPUT_GAP_SEPARATOR"] + "[0-9]{2}\\" + _config_AppConfig__WEBPACK_IMPORTED_MODULE_1__["DATE_INPUT_GAP_SEPARATOR"] + "[0-9]{4}";
    var regex = new RegExp(regex_string);
    if (!regex.test(field)) {
        return false;
    }
    var split = field.split(_config_AppConfig__WEBPACK_IMPORTED_MODULE_1__["DATE_INPUT_GAP_SEPARATOR"]);
    var month = parseInt(split[0]);
    var day = parseInt(split[1]);
    var month_max_config = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };
    if (month < 1 || month > 12) {
        return false;
    }
    if (day < 1) {
        return false;
    }
    if (month_max_config[month] < day) {
        return false;
    }
    return true;
}
/**
 * Validate a date is not in the future.  If date is not in the proper format, it will pass here
 */
function validateDateNotFuture(field) {
    if (field === undefined || field === null || !validateDateFormatted(field)) {
        return true;
    }
    var split = field.split(_config_AppConfig__WEBPACK_IMPORTED_MODULE_1__["DATE_INPUT_GAP_SEPARATOR"]);
    var month = parseInt(split[0]);
    var day = parseInt(split[1]);
    var year = parseInt(split[2]);
    var current_year = new Date().getFullYear();
    var current_month = new Date().getMonth() + 1;
    var current_day = new Date().getDate();
    if (year > current_year) {
        return false;
    }
    if (year == current_year && month > current_month) {
        return false;
    }
    return !(year == current_year && month == current_month && day > current_day);
}
/**
 * Validate a zip code
 * Check against a regexp for formatting, then min and max lengths
 * regexp: check for 1+ numerics, followed by optional spaces, dashes and numerics
 */
function validateZipCode(field) {
    if (field === undefined || field === null) {
        return false;
    }
    var zip_regexp = /^[0-9]+(?:[-\s]*)?(?:[0-9]*)?$/;
    if (zip_regexp.test(field) !== true) {
        return false;
    }
    return validateMinLength(field, 5) && validateMaxLength(field, 10);
}
/**
 * Verify the value is numeric and 3-4 characters long
 */
function validateCVC(field) {
    if (field === undefined || field === null) {
        return false;
    }
    var cvc_regexp = /^[0-9]{3,4}?$/;
    if (cvc_regexp.test(field) === true) {
        return true;
    }
    return false;
}
function validateCreditCardNumber(field) {
    if (field === undefined || field === null) {
        return false;
    }
    var validation_result = card_validator__WEBPACK_IMPORTED_MODULE_0__["number"](field);
    return validation_result.isValid;
}
function validateExpiration(expiration_month, expiration_year) {
    var current_year = new Date().getFullYear();
    if (expiration_year > current_year) {
        return true;
    }
    var current_month = new Date().getMonth() + 1;
    return current_month <= expiration_month;
}
/**
 * Validate a field value is a number.  Null field values pass
 *
 * Fail if input can't be parsed into an integer
 *
 * Fail if input contains characters other than number characters
 */
function validateInteger(field_value) {
    if (field_value === undefined || field_value === null || field_value === "") {
        return true;
    }
    if (isNaN(parseInt(field_value))) {
        return false;
    }
    var regex = new RegExp('^[0-9]+$');
    return regex.test(field_value);
}
/**
 * Validate that input number is less than a max.
 *
 * If the value is undefined or not capable of being parsed into an integer
 * pass validation
 */
function validateMax(field_value, max) {
    if (field_value === undefined || field_value === null) {
        return true;
    }
    var int = parseInt(field_value);
    if (isNaN(int)) {
        return true;
    }
    return int <= max;
}
/**
 * Ensure two fields are equal.  If corresponding value is absent, valid
 */
function validateEqual(field_value, corresponding_value) {
    if (corresponding_value === null || typeof corresponding_value === "undefined") {
        return true;
    }
    return field_value === corresponding_value;
}
/**
 * Verify a field has been confirmed
 */
function validateConfirmed(field) {
    if (field === undefined || field === null) {
        return false;
    }
    return field !== false;
}


/***/ }),

/***/ "./src/js/models/ValidationRules.ts":
/*!******************************************!*\
  !*** ./src/js/models/ValidationRules.ts ***!
  \******************************************/
/*! exports provided: MaxValidationRule, MinLengthValidationRule, EqualValidationRule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaxValidationRule", function() { return MaxValidationRule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MinLengthValidationRule", function() { return MinLengthValidationRule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqualValidationRule", function() { return EqualValidationRule; });
var MaxValidationRule = /** @class */ (function () {
    function MaxValidationRule(max) {
        this.max = max;
    }
    MaxValidationRule.prototype.toString = function () {
        return "max:" + this.max;
    };
    return MaxValidationRule;
}());

var MinLengthValidationRule = /** @class */ (function () {
    function MinLengthValidationRule(min) {
        this.min = min;
    }
    MinLengthValidationRule.prototype.toString = function () {
        return "min_length:" + this.min;
    };
    return MinLengthValidationRule;
}());

var EqualValidationRule = /** @class */ (function () {
    function EqualValidationRule(field) {
        this.field = field;
    }
    EqualValidationRule.prototype.toString = function () {
        return "equal:" + this.field;
    };
    return EqualValidationRule;
}());



/***/ }),

/***/ "./src/js/pages/CreateAccount/AccountTypeSelect.vue":
/*!**********************************************************!*\
  !*** ./src/js/pages/CreateAccount/AccountTypeSelect.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AccountTypeSelect_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AccountTypeSelect.vue?vue&type=script&lang=ts& */ "./src/js/pages/CreateAccount/AccountTypeSelect.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _AccountTypeSelect_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/pages/CreateAccount/AccountTypeSelect.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/pages/CreateAccount/AccountTypeSelect.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************!*\
  !*** ./src/js/pages/CreateAccount/AccountTypeSelect.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_AccountTypeSelect_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./AccountTypeSelect.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/AccountTypeSelect.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_AccountTypeSelect_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/pages/CreateAccount/AddressForm.vue":
/*!****************************************************!*\
  !*** ./src/js/pages/CreateAccount/AddressForm.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AddressForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddressForm.vue?vue&type=script&lang=ts& */ "./src/js/pages/CreateAccount/AddressForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _AddressForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/pages/CreateAccount/AddressForm.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/pages/CreateAccount/AddressForm.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************!*\
  !*** ./src/js/pages/CreateAccount/AddressForm.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_AddressForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./AddressForm.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/AddressForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_AddressForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/pages/CreateAccount/CreateAccount.vue":
/*!******************************************************!*\
  !*** ./src/js/pages/CreateAccount/CreateAccount.vue ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CreateAccount_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateAccount.vue?vue&type=script&lang=ts& */ "./src/js/pages/CreateAccount/CreateAccount.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _CreateAccount_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/pages/CreateAccount/CreateAccount.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/pages/CreateAccount/CreateAccount.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************!*\
  !*** ./src/js/pages/CreateAccount/CreateAccount.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateAccount_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./CreateAccount.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/CreateAccount.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateAccount_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/pages/CreateAccount/EmergencyContactForm.vue":
/*!*************************************************************!*\
  !*** ./src/js/pages/CreateAccount/EmergencyContactForm.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EmergencyContactForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EmergencyContactForm.vue?vue&type=script&lang=ts& */ "./src/js/pages/CreateAccount/EmergencyContactForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _EmergencyContactForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/pages/CreateAccount/EmergencyContactForm.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/pages/CreateAccount/EmergencyContactForm.vue?vue&type=script&lang=ts&":
/*!**************************************************************************************!*\
  !*** ./src/js/pages/CreateAccount/EmergencyContactForm.vue?vue&type=script&lang=ts& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_EmergencyContactForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./EmergencyContactForm.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/EmergencyContactForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_EmergencyContactForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/pages/CreateAccount/ForeignInfoForm.vue":
/*!********************************************************!*\
  !*** ./src/js/pages/CreateAccount/ForeignInfoForm.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ForeignInfoForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ForeignInfoForm.vue?vue&type=script&lang=ts& */ "./src/js/pages/CreateAccount/ForeignInfoForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _ForeignInfoForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/pages/CreateAccount/ForeignInfoForm.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/pages/CreateAccount/ForeignInfoForm.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************!*\
  !*** ./src/js/pages/CreateAccount/ForeignInfoForm.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_ForeignInfoForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./ForeignInfoForm.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/ForeignInfoForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_ForeignInfoForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/pages/CreateAccount/PasswordForm.vue":
/*!*****************************************************!*\
  !*** ./src/js/pages/CreateAccount/PasswordForm.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PasswordForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PasswordForm.vue?vue&type=script&lang=ts& */ "./src/js/pages/CreateAccount/PasswordForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _PasswordForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/pages/CreateAccount/PasswordForm.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/pages/CreateAccount/PasswordForm.vue?vue&type=script&lang=ts&":
/*!******************************************************************************!*\
  !*** ./src/js/pages/CreateAccount/PasswordForm.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./PasswordForm.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/PasswordForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/pages/CreateAccount/PersonalInfoForm.vue":
/*!*********************************************************!*\
  !*** ./src/js/pages/CreateAccount/PersonalInfoForm.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PersonalInfoForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PersonalInfoForm.vue?vue&type=script&lang=ts& */ "./src/js/pages/CreateAccount/PersonalInfoForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _PersonalInfoForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/pages/CreateAccount/PersonalInfoForm.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/pages/CreateAccount/PersonalInfoForm.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************!*\
  !*** ./src/js/pages/CreateAccount/PersonalInfoForm.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_PersonalInfoForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./PersonalInfoForm.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/pages/CreateAccount/PersonalInfoForm.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_PersonalInfoForm_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/services/CreateAccountService.ts":
/*!*************************************************!*\
  !*** ./src/js/services/CreateAccountService.ts ***!
  \*************************************************/
/*! exports provided: CreateAccountService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateAccountService", function() { return CreateAccountService; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../adaptors/APIAdaptors/CreateAccountAPIAdaptor */ "./src/js/adaptors/APIAdaptors/CreateAccountAPIAdaptor.ts");


/**
 * Service class for interacting with API for create account purposes
 */
var CreateAccountService = /** @class */ (function () {
    function CreateAccountService() {
    }
    /**
     * Transform and submit personal information data
     */
    CreateAccountService.SubmitPersonalInformation = function (payload, account_type) {
        return new Promise(function (resolve, reject) {
            var adapted_payload = _adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptExportedPersonalInformationFormToAPIPayload(payload, account_type);
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/create-account/personal-info', adapted_payload).then(function (response) {
                resolve(_adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptPersonalInformationSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            });
        });
    };
    /**
     * Transform and submit address information
     */
    CreateAccountService.SubmitAddressInformation = function (payload, account_id) {
        return new Promise(function (resolve, reject) {
            var adapted_payload = _adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptExportedAddressFormToAPIPayload(payload, account_id);
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/create-account/address', adapted_payload).then(function (response) {
                resolve(_adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptAddressSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            });
        });
    };
    /**
     * Transform and emergency contact information
     */
    CreateAccountService.SubmitEmergencyContactInformation = function (payload, account_id) {
        return new Promise(function (resolve, reject) {
            var adapted_payload = _adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptExportedEmergencyContactFormToAPIPayload(payload, account_id);
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/create-account/emergency-contact', adapted_payload).then(function (response) {
                resolve(_adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptExportedEmergencyContactSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            });
        });
    };
    /**
     * Transform and submit password information
     */
    CreateAccountService.SubmitPassword = function (payload, account_id) {
        return new Promise(function (resolve, reject) {
            var adapted_payload = _adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptExportedPasswordFormToAPIPayload(payload, account_id);
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/create-account/password', adapted_payload).then(function (response) {
                resolve(_adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptPasswordSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            });
        });
    };
    /**
     * Transform and submit federation information
     */
    CreateAccountService.SubmitFederationInformation = function (payload, account_id) {
        return new Promise(function (resolve, reject) {
            var adapted_payload = _adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptExportedFederationInfoFormToAPIPayload(payload, account_id);
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/create-account/federation-information', adapted_payload).then(function (response) {
                resolve(_adaptors_APIAdaptors_CreateAccountAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["CreateAccountAPIAdaptor"].adaptFederationInformationSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            });
        });
    };
    return CreateAccountService;
}());



/***/ }),

/***/ "./src/js/services/FormOptionService.ts":
/*!**********************************************!*\
  !*** ./src/js/services/FormOptionService.ts ***!
  \**********************************************/
/*! exports provided: FormOptionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormOptionService", function() { return FormOptionService; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Service class for interacting with API in relation to FormOptions
 */
var FormOptionService = /** @class */ (function () {
    function FormOptionService() {
    }
    /**
     * Get all form options and configurations needed for Create Account
     * @note: adapter layer is not currently in place and will need to be added if necessary
     */
    FormOptionService.GetCreateAccountOptions = function () {
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.get('/api/form-options/component/create-account').then(function (response) {
                if (response.data.options) {
                    resolve(response.data.options);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    };
    FormOptionService.GetEditProfileOptions = function () {
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.get('/api/form-options/component/edit-profile').then(function (response) {
                if (response.data.options) {
                    resolve({
                        user_prefixes: response.data.options.user_prefixes,
                        user_suffixes: response.data.options.user_suffixes,
                        mobile_carriers: response.data.options.mobile_carriers,
                    });
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    };
    FormOptionService.getClubOptions = function () {
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.get('/api/form-options/clubs').then(function (response) {
                if (response.data.options) {
                    resolve(response.data.options);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    };
    FormOptionService.getBillingAddressOptions = function () {
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.get('/api/form-options/component/billing-address').then(function (response) {
                if (response.data.options) {
                    resolve(response.data.options);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    };
    return FormOptionService;
}());



/***/ }),

/***/ "./src/js/services/SkateTestEquivalencyService.ts":
/*!********************************************************!*\
  !*** ./src/js/services/SkateTestEquivalencyService.ts ***!
  \********************************************************/
/*! exports provided: SkateTestEquivalencyService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkateTestEquivalencyService", function() { return SkateTestEquivalencyService; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adaptors_APIAdaptors_SkateTestEquivalencyAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../adaptors/APIAdaptors/SkateTestEquivalencyAPIAdaptor */ "./src/js/adaptors/APIAdaptors/SkateTestEquivalencyAPIAdaptor.ts");


/**
 * Service class for interacting with API in relation to SkateTestEquivalency
 */
var SkateTestEquivalencyService = /** @class */ (function () {
    function SkateTestEquivalencyService() {
    }
    /**
     * Adapt and submit data for a new Skate Test Equivalency
     */
    SkateTestEquivalencyService.AddSkateTestEquivalency = function (payload, account_id) {
        return new Promise(function (resolve, reject) {
            var adapted_payload = _adaptors_APIAdaptors_SkateTestEquivalencyAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["SkateTestEquivalencyAPIAdaptor"].adaptSkateTestEquivalencyStateDataToAPIPayload(payload, account_id);
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/skate-test-equivalency/save', adapted_payload).then(function (response) {
                resolve(_adaptors_APIAdaptors_SkateTestEquivalencyAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["SkateTestEquivalencyAPIAdaptor"].adaptSkateTestEquivalencySubmissionResponse(response.data));
            }).catch(function () {
                reject();
            });
        });
    };
    return SkateTestEquivalencyService;
}());



/***/ }),

/***/ "./src/js/store/CreateAccount/index.ts":
/*!*********************************************!*\
  !*** ./src/js/store/CreateAccount/index.ts ***!
  \*********************************************/
/*! exports provided: State, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _Modules_FormOptionsState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Modules/FormOptionsState */ "./src/js/store/Modules/FormOptionsState.ts");
/* harmony import */ var _services_CreateAccountService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/CreateAccountService */ "./src/js/services/CreateAccountService.ts");
/* harmony import */ var _services_SkateTestEquivalencyService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/SkateTestEquivalencyService */ "./src/js/services/SkateTestEquivalencyService.ts");





vue__WEBPACK_IMPORTED_MODULE_0__["default"].use(vuex__WEBPACK_IMPORTED_MODULE_1__["default"]);
var State = /** @class */ (function () {
    function State() {
        this.account_type = null;
        this.personal_information = null;
        this.foreign_account_subtype = [];
    }
    return State;
}());

var actions = {
    /**
     * Handle the completion of the personal information form
     * Trigger data submission and react to response
     * If successful, store applicable SavedPersonalInformation for reuse
     */
    completePersonalInformation: function (context, payload) {
        return new Promise(function (resolve, reject) {
            var accountType = context.state.account_type;
            _services_CreateAccountService__WEBPACK_IMPORTED_MODULE_3__["CreateAccountService"].SubmitPersonalInformation(payload, accountType).then(function (result) {
                if (result.success) {
                    context.commit('setPersonalInformation', result.data);
                }
                resolve(result);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Handle the completion of the address form
     * Trigger data submission and react to response
     */
    completeAddress: function (context, payload) {
        return new Promise(function (resolve, reject) {
            var account_id = context.getters['account_id'];
            _services_CreateAccountService__WEBPACK_IMPORTED_MODULE_3__["CreateAccountService"].SubmitAddressInformation(payload, account_id).then(function (result) {
                if (result.success) {
                    //save data to state
                }
                resolve(result);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Handle the completion of the emergency contact form
     * Trigger data submission and react to response
     */
    completeEmergencyContact: function (context, payload) {
        return new Promise(function (resolve, reject) {
            var account_id = context.getters['account_id'];
            _services_CreateAccountService__WEBPACK_IMPORTED_MODULE_3__["CreateAccountService"].SubmitEmergencyContactInformation(payload, account_id).then(function (result) {
                if (result.success) {
                    //save data to state
                }
                resolve(result);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Handle the completion of the password form
     * Trigger data submission and react to response
     */
    completePassword: function (context, payload) {
        return new Promise(function (resolve, reject) {
            var account_id = context.getters['account_id'];
            _services_CreateAccountService__WEBPACK_IMPORTED_MODULE_3__["CreateAccountService"].SubmitPassword(payload, account_id).then(function (result) {
                if (result.success) {
                    //save data to state
                }
                resolve(result);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Handle the completion of the federation information form
     * Trigger data submission and react to response
     */
    completeFederationInformation: function (context, payload) {
        return new Promise(function (resolve, reject) {
            var account_id = context.getters['account_id'];
            _services_CreateAccountService__WEBPACK_IMPORTED_MODULE_3__["CreateAccountService"].SubmitFederationInformation(payload, account_id).then(function (result) {
                if (result.success) {
                    //save data to state
                    context.commit('setForeignAccountTypes', payload.user_type);
                }
                resolve(result);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Handle the completion of a Skate Test Equivalency form
     * Trigger data submission and react to response
     */
    completeSkateTestEquivalency: function (context, payload) {
        return new Promise(function (resolve, reject) {
            var account_id = context.getters['account_id'];
            _services_SkateTestEquivalencyService__WEBPACK_IMPORTED_MODULE_4__["SkateTestEquivalencyService"].AddSkateTestEquivalency(payload, account_id).then(function (result) {
                if (result.success) {
                }
                resolve(result);
            }).catch(function () {
                reject();
            });
        });
    }
};
var getters = {
    /**
     * Get the member number for the active user during account creation
     * Null if personal information has not been successfully submitted
     */
    member_number: function (state) {
        if (state.personal_information && state.personal_information.member_number) {
            return state.personal_information.member_number;
        }
        return null;
    },
    /**
     * Get the account id for the active user during account creation
     * Null if personal information has not been successfully submitted
     */
    account_id: function (state) {
        if (state.personal_information && state.personal_information.account_id) {
            return state.personal_information.account_id;
        }
        return null;
    },
    /**
     * Whether the current user needs to submit federation information
     */
    requires_federation_info: function (state) {
        return state.account_type === "foreign";
    },
    /**
     * Whether the current user needs to submit skate test information
     */
    skate_test_required: function (state, getters) {
        if (!getters['requires_federation_info']) {
            return false;
        }
        if (state.foreign_account_subtype.length === 0) {
            return true;
        }
        return state.foreign_account_subtype.indexOf('skater') !== -1;
    },
    /**
     * The number of required steps for account creation, depending on prior selections
     */
    required_step_count: function (state, getters) {
        if (!getters['requires_federation_info']) {
            return 4;
        }
        if (!getters['skate_test_required']) {
            return 5;
        }
        return 6;
    }
};
var mutations = {
    /**
     * Commit account type to state
     */
    setAccountTypeKey: function (state, account_type_key) {
        state.account_type = account_type_key;
    },
    /**
     * Commit personal information to state
     */
    setPersonalInformation: function (state, data) {
        state.personal_information = data;
    },
    /**
     * Commit foreign account subtypes to state
     */
    setForeignAccountTypes: function (state, account_subtype_key) {
        state.foreign_account_subtype = account_subtype_key;
    },
};
/* harmony default export */ __webpack_exports__["default"] = (new vuex__WEBPACK_IMPORTED_MODULE_1__["default"].Store({
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations,
    modules: {
        form_options: _Modules_FormOptionsState__WEBPACK_IMPORTED_MODULE_2__["FormOptionsState"],
    }
}));


/***/ }),

/***/ "./src/js/store/Modules/FormOptionsState.ts":
/*!**************************************************!*\
  !*** ./src/js/store/Modules/FormOptionsState.ts ***!
  \**************************************************/
/*! exports provided: State, FormOptionsState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormOptionsState", function() { return FormOptionsState; });
/* harmony import */ var _services_FormOptionService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/FormOptionService */ "./src/js/services/FormOptionService.ts");

/**
 * Config outlining fetchers that complete the needs of child fetchers
 */
var FETCHER_CONFIG = {
    create_account: {
        children: [
            'states',
            'countries',
            'provinces',
            'federations',
            'categorized_skate_test_options',
        ]
    },
    edit_profile: {
        children: [
            'user_prefixes',
            'user_suffixes',
            'mobile_carriers'
        ]
    },
    billing_address: {
        children: [
            'states',
            'provinces',
            'billing_countries'
        ]
    }
};
var State = /** @class */ (function () {
    function State() {
        this.states = [];
        this.countries = [];
        this.federations = [];
        this.provinces = [];
        this.categorized_skate_test_options = {
            free_skating: [],
            pair: [],
            dance: [],
            free_dance: [],
            figure: [],
        };
        this.skate_test_disciplines = [];
        this.user_prefixes = [];
        this.user_suffixes = [];
        this.mobile_carriers = [];
        this.waiver_relationships = [];
        this.clubs = [];
        this.billing_countries = [];
        this.volunteer_request_experiences = [];
        /**
         * Fetchers in the process of retrieving data
         */
        this.active_fetchers = [];
        /**
         * Fetchers that have completed the process of retrieving data
         */
        this.completed_fetchers = [];
    }
    return State;
}());

var actions = {
    /**
     * Fetch form options for all create account screens
     */
    fetchCreateAccountOptions: function (context) {
        var active_key = 'create_account';
        return new Promise(function (resolve, reject) {
            if (context.getters['block_fetcher'](active_key)) {
                resolve();
                return;
            }
            context.commit('addActiveFetcher', active_key);
            _services_FormOptionService__WEBPACK_IMPORTED_MODULE_0__["FormOptionService"].GetCreateAccountOptions().then(function (result) {
                context.commit('removeActiveFetcher', active_key);
                context.commit('setCreateAccountOptions', result);
                context.commit('addCompletedFetcher', active_key);
                resolve();
            }).catch(function () {
                context.commit('removeActiveFetcher', active_key);
                reject();
            });
        });
    },
    fetchBillingAddressOptions: function (context) {
        var active_key = 'billing_address';
        return new Promise(function (resolve, reject) {
            if (context.getters['block_fetcher'](active_key)) {
                resolve();
                return;
            }
            context.commit('addActiveFetcher', active_key);
            _services_FormOptionService__WEBPACK_IMPORTED_MODULE_0__["FormOptionService"].getBillingAddressOptions().then(function (result) {
                context.commit('removeActiveFetcher', active_key);
                context.commit('setBillingAddressOptions', result);
                context.commit('addCompletedFetcher', active_key);
                resolve();
            }).catch(function () {
                context.commit('removeActiveFetcher', active_key);
                reject();
            });
        });
    },
    fetchEditProfileOptions: function (context) {
        var active_key = 'edit_profile';
        return new Promise(function (resolve, reject) {
            if (context.getters['block_fetcher'](active_key)) {
                resolve();
                return;
            }
            context.commit('addActiveFetcher', active_key);
            _services_FormOptionService__WEBPACK_IMPORTED_MODULE_0__["FormOptionService"].GetEditProfileOptions().then(function (result) {
                context.commit('removeActiveFetcher', active_key);
                context.commit('setEditProfileOptions', result);
                context.commit('addCompletedFetcher', active_key);
                resolve();
            }).catch(function () {
                context.commit('removeActiveFetcher', active_key);
                reject();
            });
        });
    },
    fetchClubs: function (context) {
        var active_key = 'clubs';
        return new Promise(function (resolve, reject) {
            if (context.getters['block_fetcher'](active_key)) {
                resolve();
                return;
            }
            context.commit('addActiveFetcher', active_key);
            _services_FormOptionService__WEBPACK_IMPORTED_MODULE_0__["FormOptionService"].getClubOptions().then(function (result) {
                context.commit('removeActiveFetcher', active_key);
                context.commit('setClubOptions', result);
                context.commit('addCompletedFetcher', active_key);
                resolve();
            }).catch(function () {
                context.commit('removeActiveFetcher', active_key);
                reject();
            });
        });
    }
};
var getters = {
    /**
     * Function to return skate test options by a supplied discipline key
     */
    skate_test_options: function (state) {
        return function (discipline_key) {
            return state.categorized_skate_test_options[discipline_key];
        };
    },
    /**
     * Whether a fetcher should be blocked based on current state
     */
    block_fetcher: function (state) {
        return function (fetcher_key) {
            return state.active_fetchers.indexOf(fetcher_key) !== -1 || state.completed_fetchers.indexOf(fetcher_key) !== -1;
        };
    },
    /**
     * State State options
     */
    states: function (state) {
        return state.states;
    },
    /**
     * State Country options
     */
    countries: function (state) {
        return state.countries;
    },
    /**
     * State Federation options
     */
    federations: function (state) {
        return state.federations;
    },
    /**
     * State Province options
     */
    provinces: function (state) {
        return state.provinces;
    },
    /**
     * State SkateTestDiscipline options
     */
    skate_test_disciplines: function (state) {
        return state.skate_test_disciplines;
    },
    edit_profile_options: function (state) {
        return {
            prefixes: state.user_prefixes,
            suffixes: state.user_suffixes,
            mobile_carriers: state.mobile_carriers
        };
    },
    billing_countries: function (state) {
        return state.billing_countries;
    },
    waiver_relationships: function (state) {
        return state.waiver_relationships;
    },
    clubs: function (state) {
        return state.clubs;
    },
    /**
     * Get the form option for a state by its value
     */
    state_from_value: function (state, getters) {
        return function (value) {
            var states = getters['states'];
            for (var i = 0; i < states.length; i++) {
                var state_option = states[i];
                if (state_option.value === value) {
                    return state_option;
                }
            }
            return null;
        };
    },
    /**
     * Get the form option for a country by its value
     */
    country_from_value: function (state, getters) {
        return function (value) {
            var countries = getters['countries'];
            for (var i = 0; i < countries.length; i++) {
                var country_option = countries[i];
                if (country_option.value === value) {
                    return country_option;
                }
            }
            return null;
        };
    },
    /**
     * Get the form option for a province by its value
     */
    province_from_value: function (state, getters) {
        return function (value) {
            var provinces = getters['provinces'];
            for (var i = 0; i < provinces.length; i++) {
                var province_option = provinces[i];
                if (province_option.value === value) {
                    return province_option;
                }
            }
            return null;
        };
    }
};
var mutations = {
    setStateOptions: function (state, value) {
        state.states = value;
    },
    setCountryOptions: function (state, value) {
        state.countries = value;
    },
    setFederationOptions: function (state, value) {
        state.federations = value;
    },
    setProvinceOptions: function (state, value) {
        state.provinces = value;
    },
    setCategorizedSkateTestOptions: function (state, value) {
        state.categorized_skate_test_options = value;
    },
    /**
     * Add active fetcher to state.  If fetcher has children, include them
     */
    addActiveFetcher: function (state, key) {
        state.active_fetchers.push(key);
        if (key in FETCHER_CONFIG) {
            var children = FETCHER_CONFIG[key].children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                state.active_fetchers.push(child);
            }
        }
    },
    /**
     * Remove active fetcher from state.  If fetcher has children, remove them as well
     */
    removeActiveFetcher: function (state, key) {
        state.active_fetchers.splice(state.active_fetchers.indexOf(key), 1);
        if (key in FETCHER_CONFIG) {
            var children = FETCHER_CONFIG[key].children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                state.active_fetchers.splice(state.active_fetchers.indexOf(child), 1);
            }
        }
    },
    /**
     * Add completed fetcher to state.  If fetcher has children, include them
     */
    addCompletedFetcher: function (state, key) {
        state.completed_fetchers.push(key);
        if (key in FETCHER_CONFIG) {
            var children = FETCHER_CONFIG[key].children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                state.completed_fetchers.push(child);
            }
        }
    },
    /**
     * Commit create account options to state
     */
    setCreateAccountOptions: function (state, payload) {
        var states = payload.states, countries = payload.countries, provinces = payload.provinces, federations = payload.federations, skate_tests = payload.skate_tests, skate_test_disciplines = payload.skate_test_disciplines;
        state.states = states;
        state.countries = countries;
        state.federations = federations;
        state.provinces = provinces;
        state.categorized_skate_test_options = skate_tests;
        state.skate_test_disciplines = skate_test_disciplines;
    },
    setBillingAddressOptions: function (state, payload) {
        var states = payload.states, countries = payload.countries, provinces = payload.provinces;
        state.states = states;
        state.billing_countries = countries;
        state.provinces = provinces;
    },
    setEditProfileOptions: function (state, payload) {
        var user_prefixes = payload.user_prefixes, user_suffixes = payload.user_suffixes, mobile_carriers = payload.mobile_carriers;
        state.user_prefixes = user_prefixes;
        state.user_suffixes = user_suffixes;
        state.mobile_carriers = mobile_carriers;
    },
    setWaiverRelationships: function (state, relationships) {
        state.waiver_relationships = relationships;
    },
    setClubOptions: function (state, options) {
        state.clubs = options;
    },
    setVolunteerRequestExperienceOptions: function (state, options) {
        state.volunteer_request_experiences = options;
    }
};
var FormOptionsState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/store/Modules/SkateTestEquivalencyState.ts":
/*!***********************************************************!*\
  !*** ./src/js/store/Modules/SkateTestEquivalencyState.ts ***!
  \***********************************************************/
/*! exports provided: State, SkateTestEquivalencyState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkateTestEquivalencyState", function() { return SkateTestEquivalencyState; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var State = /** @class */ (function () {
    function State() {
        this.test_data = {};
    }
    return State;
}());

var actions = {
//
};
var getters = {
    /**
     * List of testable disciplines for form
     */
    testable_disciplines: function (state, getters, rootstate, rootGetters) {
        return rootGetters['form_options/skate_test_disciplines'];
    },
    /**
     * Get the active data for a specific discipline
     */
    discipline_data: function (state) {
        return function (discipline_key) {
            return state.test_data[discipline_key];
        };
    },
    /**
     * Get the active test data for a specific discipline
     */
    discipline_test: function (state, getters) {
        return function (discipline_key) {
            var data = getters['discipline_data'](discipline_key);
            return data ? data.test : null;
        };
    },
    /**
     * Export state values as independent variables from state
     */
    export_data: function (state, getters) {
        var testable_disciplines = getters['testable_disciplines'];
        var result = {};
        for (var i = 0; i < testable_disciplines.length; i++) {
            var testableDiscipline = testable_disciplines[i].key;
            result[testableDiscipline] = null;
        }
        for (var i in result) {
            var state_value = i in state.test_data ? state.test_data[i] : false;
            if (state_value) {
                result[i] = __assign({}, state_value, { test: __assign({}, state_value.test) });
            }
        }
        return result;
    }
};
var mutations = {
    /**
     * Add data to a discipline to state
     */
    addDisciplineData: function (state, data) {
        var key = data.key, form_data = data.form_data;
        state.test_data[key] = form_data;
    },
    /**
     * Remove data from a discipline in state
     */
    removeDisciplineData: function (state, key) {
        if (key in state.test_data) {
            var current = __assign({}, state.test_data);
            delete current[key];
            state.test_data = current;
        }
    }
};
var SkateTestEquivalencyState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/vendor/modernizr.custom.js":
/*!*******************************************!*\
  !*** ./src/js/vendor/modernizr.custom.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Custom build of modernizr.  Checking for support of flexbox, flexboxtweener and appearance css support
 */

/*! modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-appearance-flexbox-flexboxtweener-setclasses !*/
!function (e, n, t) {
  function r(e, n) {
    return _typeof(e) === n;
  }

  function o() {
    var e, n, t, o, s, i, l;

    for (var a in x) {
      if (x.hasOwnProperty(a)) {
        if (e = [], n = x[a], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length)) for (t = 0; t < n.options.aliases.length; t++) {
          e.push(n.options.aliases[t].toLowerCase());
        }

        for (o = r(n.fn, "function") ? n.fn() : n.fn, s = 0; s < e.length; s++) {
          i = e[s], l = i.split("."), 1 === l.length ? Modernizr[l[0]] = o : (!Modernizr[l[0]] || Modernizr[l[0]] instanceof Boolean || (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])), Modernizr[l[0]][l[1]] = o), C.push((o ? "" : "no-") + l.join("-"));
        }
      }
    }
  }

  function s(e) {
    var n = S.className,
        t = Modernizr._config.classPrefix || "";

    if (_ && (n = n.baseVal), Modernizr._config.enableJSClass) {
      var r = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
      n = n.replace(r, "$1" + t + "js$2");
    }

    Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), _ ? S.className.baseVal = n : S.className = n);
  }

  function i(e, n) {
    return !!~("" + e).indexOf(n);
  }

  function l() {
    return "function" != typeof n.createElement ? n.createElement(arguments[0]) : _ ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments);
  }

  function a(e) {
    return e.replace(/([a-z])-([a-z])/g, function (e, n, t) {
      return n + t.toUpperCase();
    }).replace(/^-/, "");
  }

  function f(e, n) {
    return function () {
      return e.apply(n, arguments);
    };
  }

  function u(e, n, t) {
    var o;

    for (var s in e) {
      if (e[s] in n) return t === !1 ? e[s] : (o = n[e[s]], r(o, "function") ? f(o, t || n) : o);
    }

    return !1;
  }

  function d(e) {
    return e.replace(/([A-Z])/g, function (e, n) {
      return "-" + n.toLowerCase();
    }).replace(/^ms-/, "-ms-");
  }

  function p(n, t, r) {
    var o;

    if ("getComputedStyle" in e) {
      o = getComputedStyle.call(e, n, t);
      var s = e.console;
      if (null !== o) r && (o = o.getPropertyValue(r));else if (s) {
        var i = s.error ? "error" : "log";
        s[i].call(s, "getComputedStyle returning null, its possible modernizr test results are inaccurate");
      }
    } else o = !t && n.currentStyle && n.currentStyle[r];

    return o;
  }

  function c() {
    var e = n.body;
    return e || (e = l(_ ? "svg" : "body"), e.fake = !0), e;
  }

  function m(e, t, r, o) {
    var s,
        i,
        a,
        f,
        u = "modernizr",
        d = l("div"),
        p = c();
    if (parseInt(r, 10)) for (; r--;) {
      a = l("div"), a.id = o ? o[r] : u + (r + 1), d.appendChild(a);
    }
    return s = l("style"), s.type = "text/css", s.id = "s" + u, (p.fake ? p : d).appendChild(s), p.appendChild(d), s.styleSheet ? s.styleSheet.cssText = e : s.appendChild(n.createTextNode(e)), d.id = u, p.fake && (p.style.background = "", p.style.overflow = "hidden", f = S.style.overflow, S.style.overflow = "hidden", S.appendChild(p)), i = t(d, e), p.fake ? (p.parentNode.removeChild(p), S.style.overflow = f, S.offsetHeight) : d.parentNode.removeChild(d), !!i;
  }

  function y(n, r) {
    var o = n.length;

    if ("CSS" in e && "supports" in e.CSS) {
      for (; o--;) {
        if (e.CSS.supports(d(n[o]), r)) return !0;
      }

      return !1;
    }

    if ("CSSSupportsRule" in e) {
      for (var s = []; o--;) {
        s.push("(" + d(n[o]) + ":" + r + ")");
      }

      return s = s.join(" or "), m("@supports (" + s + ") { #modernizr { position: absolute; } }", function (e) {
        return "absolute" == p(e, null, "position");
      });
    }

    return t;
  }

  function g(e, n, o, s) {
    function f() {
      d && (delete T.style, delete T.modElem);
    }

    if (s = r(s, "undefined") ? !1 : s, !r(o, "undefined")) {
      var u = y(e, o);
      if (!r(u, "undefined")) return u;
    }

    for (var d, p, c, m, g, v = ["modernizr", "tspan", "samp"]; !T.style && v.length;) {
      d = !0, T.modElem = l(v.shift()), T.style = T.modElem.style;
    }

    for (c = e.length, p = 0; c > p; p++) {
      if (m = e[p], g = T.style[m], i(m, "-") && (m = a(m)), T.style[m] !== t) {
        if (s || r(o, "undefined")) return f(), "pfx" == n ? m : !0;

        try {
          T.style[m] = o;
        } catch (h) {}

        if (T.style[m] != g) return f(), "pfx" == n ? m : !0;
      }
    }

    return f(), !1;
  }

  function v(e, n, t, o, s) {
    var i = e.charAt(0).toUpperCase() + e.slice(1),
        l = (e + " " + P.join(i + " ") + i).split(" ");
    return r(n, "string") || r(n, "undefined") ? g(l, n, o, s) : (l = (e + " " + z.join(i + " ") + i).split(" "), u(l, n, t));
  }

  function h(e, n, r) {
    return v(e, t, t, n, r);
  }

  var C = [],
      x = [],
      w = {
    _version: "3.5.0",
    _config: {
      classPrefix: "",
      enableClasses: !0,
      enableJSClass: !0,
      usePrefixes: !0
    },
    _q: [],
    on: function on(e, n) {
      var t = this;
      setTimeout(function () {
        n(t[e]);
      }, 0);
    },
    addTest: function addTest(e, n, t) {
      x.push({
        name: e,
        fn: n,
        options: t
      });
    },
    addAsyncTest: function addAsyncTest(e) {
      x.push({
        name: null,
        fn: e
      });
    }
  },
      Modernizr = function Modernizr() {};

  Modernizr.prototype = w, Modernizr = new Modernizr();

  var S = n.documentElement,
      _ = "svg" === S.nodeName.toLowerCase(),
      b = "Moz O ms Webkit",
      P = w._config.usePrefixes ? b.split(" ") : [];

  w._cssomPrefixes = P;
  var z = w._config.usePrefixes ? b.toLowerCase().split(" ") : [];
  w._domPrefixes = z;
  var E = {
    elem: l("modernizr")
  };

  Modernizr._q.push(function () {
    delete E.elem;
  });

  var T = {
    style: E.elem.style
  };
  Modernizr._q.unshift(function () {
    delete T.style;
  }), w.testAllProps = v, w.testAllProps = h, Modernizr.addTest("appearance", h("appearance")), Modernizr.addTest("flexbox", h("flexBasis", "1px", !0)), Modernizr.addTest("flexboxtweener", h("flexAlign", "end", !0)), o(), s(C), delete w.addTest, delete w.addAsyncTest;

  for (var N = 0; N < Modernizr._q.length; N++) {
    Modernizr._q[N]();
  }

  e.Modernizr = Modernizr;
}(window, document);

/***/ }),

/***/ 2:
/*!****************************************!*\
  !*** multi ./src/js/create-account.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Test\Figure\hawkeye-ems\src\js\create-account.ts */"./src/js/create-account.ts");


/***/ })

},[[2,"/js/manifest","/js/vendor"]]]);