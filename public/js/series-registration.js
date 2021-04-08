(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/series-registration"],{

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

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        series: {
            type: Object,
            required: true
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=script&lang=ts&":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=script&lang=ts& ***!
  \*************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        discipline: {
            type: Object,
            required: true
        }
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * The value selected for the level select
             */
            level_select_value: null,
            /**
             * Whether to show the level select input
             */
            show_level_select: false
        };
    },
    computed: {
        /**
         * The currently added coaches
         */
        coaches: function () {
            return this.discipline.coaches;
        },
        /**
         * The class to apply to a level element item
         */
        level_element_class: function () {
            var _this = this;
            return function (level) {
                if (level.is_paid) {
                    return 'series-application-discipline__element--paid';
                }
                if (!_this.show_level_payment_status) {
                    return null;
                }
                return 'series-application-discipline__element--unpaid';
            };
        },
        /**
         * The currently added levels
         */
        levels: function () {
            return this.discipline.levels;
        },
        /**
         * The complete available levels for selection
         *
         * For partnered discipline, levels for which current user and partner are both eligible
         *
         * Otherwise, user eligible levels
         */
        levels_available: function () {
            return this.$store.getters['series_registration/application/user_selectable_discipline_levels'](this.discipline);
        },
        /**
         * The levels that can be selected
         *
         * `force_up` controls whether only levels above currently selected level are presented
         *
         * Otherwise show all levels that aren't already selected
         */
        levels_selectable: function () {
            var force_up = false;
            if (force_up) {
                var max_selected_level_id_1 = this.levels.reduce(function (carry, level) {
                    return level.level_id > carry ? level.level_id : carry;
                }, -1);
                return this.levels_available.filter(function (level) {
                    return level.level_id > max_selected_level_id_1;
                });
            }
            // eslint-disable-next-line
            var selected_level_ids = this.levels.map(function (level) { return level.id; });
            return this.levels_available.filter(function (level) {
                return selected_level_ids.indexOf(level.id) === -1;
            });
        },
        /**
         * The maximum number of levels the user can select
         */
        max_levels: function () {
            return this.$store.getters['series_registration/application/max_levels'];
        },
        /**
         * The notice to display in the coaches section
         */
        notice_coaches: function () {
            return {
                type: 'warning',
                message: "You may select up to " + this.discipline.coach_limit + " coaches."
            };
        },
        /**
         * The notice to display in the levels section
         */
        notice_levels: function () {
            if (!this.levels_selectable.length || this.levels.length === this.max_levels) {
                var levels_selected = this.levels.length;
                var partner_discipline = this.discipline.partner_configuration.is_partnered;
                var entity_descriptor = partner_discipline && !levels_selected ? ' with this partner' : '';
                var level_descriptor = levels_selected ? 'any more' : 'any';
                var message = "You are not eligible for " + level_descriptor + " levels" + entity_descriptor + ".";
                return {
                    type: levels_selected ? 'warning' : 'danger',
                    message: message
                };
            }
            if (!this.discipline.levels.length && this.discipline.coach_limit) {
                return {
                    type: 'warning',
                    message: 'You must select a level before adding coach(es).'
                };
            }
            return null;
        },
        /**
         * The notice to display in the partner section
         */
        notice_partner: function () {
            if (this.partner_ineligible_selected) {
                return {
                    type: 'danger',
                    message: 'You must select an eligible partner before adding levels.'
                };
            }
            if (!this.discipline.partners.length) {
                return {
                    type: 'warning',
                    message: 'You must select a partner before adding level(s).'
                };
            }
            return null;
        },
        /**
         * Whether a paid level exists for the discipline
         */
        paid_level_exists: function () {
            for (var i = 0; i < this.levels.length; i++) {
                var level = this.levels[i];
                if (level.is_paid) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Whether an ineligible partner has been selected
         */
        partner_ineligible_selected: function () {
            for (var i = 0; i < this.partners.length; i++) {
                var partner = this.partners[i];
                if (partner.ineligible) {
                    return true;
                }
            }
            return false;
        },
        /**
         * The currently added partners
         */
        partners: function () {
            return this.discipline.partners;
        },
        /**
         * Whether to show the coaches add control
         */
        show_coach_add: function () {
            return this.coaches.length < this.discipline.coach_limit;
        },
        /**
         * Whether to show the levels add control
         */
        show_level_add: function () {
            return this.levels.length < this.max_levels && !!this.levels_selectable.length;
        },
        /**
         * Whether to show payment status on level items
         */
        show_level_payment_status: function () {
            return this.$store.state.series_registration.application.saved_application_exists;
        },
        /**
         * Whether to show the partner add control
         */
        show_partner_add: function () {
            return this.partners.length === 0;
        },
        /**
         * Whether to show the coach section
         */
        show_section_coaches: function () {
            return this.levels.length > 0 && this.discipline.coach_limit > 0;
        },
        /**
         * Whether to show the levels section
         */
        show_section_levels: function () {
            if (this.discipline.partner_configuration.is_partnered) {
                return this.partners.length > 0;
            }
            return true;
        },
        /**
         * Whether to show the partner section
         */
        show_section_partner: function () {
            return this.discipline.partner_configuration.is_partnered;
        }
    },
    watch: {
        /**
         * Watch the level select value for change.  If a value is set, report the selection and reset the form input
         */
        level_select_value: function (value) {
            if (value) {
                this.levelSelect(value);
                this.show_level_select = false;
                this.level_select_value = null;
            }
        }
    },
    methods: {
        /**
         * Add a coach
         */
        coachAdd: function () {
            this.$store.dispatch('series_registration/application/openCoachSearch', this.discipline);
        },
        /**
         * Remove a coach
         */
        coachRemove: function (coach) {
            var _this = this;
            this.$store.dispatch('app/confirmAction', {
                message: "Are you sure you want to remove " + coach.first_name + " " + coach.last_name + " from your coach list?",
                action: function () {
                    var payload = {
                        coach: coach,
                        discipline: _this.discipline
                    };
                    _this.$store.dispatch('series_registration/application/removeCoach', payload);
                }
            });
        },
        /**
         * Handle the click event on the add level button
         */
        levelAdd: function () {
            if (this.levels_selectable.length > 1) {
                this.show_level_select = true;
                return;
            }
            this.levelSelect(this.levels_selectable[0]);
        },
        /**
         * Remove a level
         */
        levelRemove: function (level) {
            var _this = this;
            if (level.is_paid) {
                return;
            }
            this.$store.dispatch('app/confirmAction', {
                message: "Are you sure you want to remove " + level.name + " from your levels?",
                action: function () {
                    var payload = {
                        discipline: _this.discipline,
                        level: level
                    };
                    _this.$store.dispatch('series_registration/application/removeLevel', payload);
                }
            });
        },
        /**
         * Select a level
         */
        levelSelect: function (level) {
            var payload = {
                discipline: this.discipline,
                level: level
            };
            this.$store.dispatch('series_registration/application/selectLevel', payload);
        },
        /**
         * Handle the click event on the add partner button
         */
        partnerAdd: function () {
            this.$store.dispatch('series_registration/application/openPartnerSearch', this.discipline);
        },
        /**
         * Remove a partner
         */
        partnerRemove: function (partner) {
            var _this = this;
            if (this.paid_level_exists) {
                return;
            }
            this.$store.dispatch('app/confirmAction', {
                message: "Are you sure you want to remove " + partner.first_name + " " + partner.last_name + " from your partner list?",
                action: function () {
                    _this.$store.dispatch('series_registration/application/removePartner', {
                        partner: partner,
                        discipline: _this.discipline
                    });
                }
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=script&lang=ts&":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=script&lang=ts& ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        series: {
            type: Object,
            required: true
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../mixins/FormMixin */ "./src/js/mixins/FormMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _models_SeriesApplicationProfileEditFormState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_models/SeriesApplicationProfileEditFormState */ "./src/js/SeriesRegistration/SeriesApplication/_models/SeriesApplicationProfileEditFormState.ts");
/* harmony import */ var _models_SeriesApplicationProfileEditFormValidator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_models/SeriesApplicationProfileEditFormValidator */ "./src/js/SeriesRegistration/SeriesApplication/_models/SeriesApplicationProfileEditFormValidator.ts");




var vueConstructor = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_FormMixin__WEBPACK_IMPORTED_MODULE_0__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueConstructor.extend({
    props: {
        value: {
            type: String,
            required: true
        }
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            form_data: new _models_SeriesApplicationProfileEditFormState__WEBPACK_IMPORTED_MODULE_2__["SeriesApplicationProfileEditFormState"](),
            is_submitting: false,
            submit_error: false,
            /**
             * The validator to use against the form data
             */
            validator_class: _models_SeriesApplicationProfileEditFormValidator__WEBPACK_IMPORTED_MODULE_3__["SeriesApplicationProfileEditFormValidator"]
        };
    },
    /**
     * On creation, set default form_data value
     */
    created: function () {
        this.form_data.email = this.value;
    },
    methods: {
        /**
         * Save attempt
         */
        attemptSave: function () {
            this.submit_attempt = true;
            if (this.valid) {
                this.doSave();
            }
        },
        /**
         * Save the edits to the form
         */
        doSave: function () {
            var _this = this;
            this.is_submitting = true;
            var payload = {
                email: this.form_data.email
            };
            this.$store.dispatch('series_registration/application/updateProfile', payload)
                .then(function () {
                _this.is_submitting = false;
                _this.$emit('close');
            })
                .catch(function (error) {
                _this.is_submitting = false;
                _this.submit_error = error;
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=script&lang=ts&":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=script&lang=ts& ***!
  \**************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _store_SeriesRegistrationState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_store/SeriesRegistrationState */ "./src/js/SeriesRegistration/_store/SeriesRegistrationState.ts");
/* harmony import */ var _partials_SeriesApplicationApplication_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_partials/SeriesApplicationApplication.vue */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue");
/* harmony import */ var _partials_SeriesApplicationProfile_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_partials/SeriesApplicationProfile.vue */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue");
/* harmony import */ var _partials_SeriesApplicationTeamProfile_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_partials/SeriesApplicationTeamProfile.vue */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue");
/* harmony import */ var _store_Modules_SkateTestHistoryState__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../store/Modules/SkateTestHistoryState */ "./src/js/store/Modules/SkateTestHistoryState.ts");
/* harmony import */ var _components_SeriesApplicationCitizenshipNotice_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../_components/SeriesApplicationCitizenshipNotice.vue */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue");








var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__["default"])(_mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    components: {
        Application: _partials_SeriesApplicationApplication_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
        Profile: _partials_SeriesApplicationProfile_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
        TeamProfile: _partials_SeriesApplicationTeamProfile_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
    },
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * The active view on the page
             */
            active_view: 'profile',
            /**
             * Data dependencies required for component
             */
            dependencies: {
                series: false
            }
        };
    },
    computed: {
        is_team_mode: function () {
            return this.$store.state.series_registration.application.is_team_series;
        },
        /**
         * The configuration for the page header
         */
        page_header: function () {
            var conf = {
                title: 'Series Application'
            };
            if (this.series) {
                conf.back_link = this.series.links.overview;
                conf.back_link_label = 'Back to Series Overview';
                if (this.is_team_mode && this.series.links.select_team) {
                    conf.back_link = this.series.links.select_team;
                    conf.back_link_label = 'Back to Select Team';
                }
            }
            return conf;
        },
        profile_component: function () {
            if (this.is_team_mode) {
                return 'team-profile';
            }
            return 'profile';
        },
        /**
         * The series for the page
         */
        series: function () {
            return this.$store.getters['series_registration/application/series'];
        },
        /**
         * Whether the active user is ineligible for the series due to their citizenship status
         */
        user_citizenship_ineligible: function () {
            return this.$store.getters['series_registration/application/user_citizenship_ineligible'];
        }
    },
    /**
     * Before component created, ensure state modules are registered and configured
     */
    beforeCreate: function () {
        var _this = this;
        if (typeof this.$store.state.series_registration === 'undefined') {
            this.$store.registerModule('series_registration', _store_SeriesRegistrationState__WEBPACK_IMPORTED_MODULE_2__["SeriesRegistrationState"]);
        }
        if (typeof this.$store.state.skate_test_history === 'undefined') {
            this.$store.registerModule('skate_test_history', _store_Modules_SkateTestHistoryState__WEBPACK_IMPORTED_MODULE_6__["SkateTestHistoryState"]);
        }
        this.$store.commit('skate_test_history/setSaveAction', function (payload) {
            return _this.$store.dispatch('series_registration/application/saveSkateTest', payload);
        });
        this.$store.commit('skate_test_history/setRemoveAction', function (payload) {
            return _this.$store.dispatch('series_registration/application/removeSkateTest', payload);
        });
    },
    /**
     * On destruction, reset the skate test history state
     */
    destroyed: function () {
        this.$store.commit('skate_test_history/reset');
    },
    methods: {
        /**
         * Whether a view is active
         */
        isActiveView: function (view) {
            return this.active_view === view;
        },
        /**
         * Load data dependencies
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('series_registration/application/fetchSeriesApplication')
                    .then(function () {
                    _this.dependencies.series = true;
                    if (_this.user_citizenship_ineligible) {
                        _this.$store.commit('app/setNotice', {
                            notice: new _components_SeriesApplicationCitizenshipNotice_vue__WEBPACK_IMPORTED_MODULE_7__["default"]({
                                propsData: {
                                    series: _this.series
                                }
                            }),
                            dismiss_override: function () {
                                if (_this.series) {
                                    window.location.assign(_this.series.links.overview);
                                    return;
                                }
                                _this.$store.commit('app/setNotice', null);
                            }
                        });
                    }
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        },
        /**
         * Select the active view for the page
         */
        selectActiveView: function (view, reset_scroll) {
            var _this = this;
            if (reset_scroll === void 0) { reset_scroll = false; }
            this.active_view = view;
            if (reset_scroll) {
                this.$nextTick(function () {
                    var $root = _this.$root;
                    $root.resetScroll();
                });
            }
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_SeriesApplicationDiscipline_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_components/SeriesApplicationDiscipline.vue */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue");
/* harmony import */ var _components_MemberSearch_MemberSearchTakeover_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../components/MemberSearch/MemberSearchTakeover.vue */ "./src/js/components/MemberSearch/MemberSearchTakeover.vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _helpers_PromiseHelpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../helpers/PromiseHelpers */ "./src/js/helpers/PromiseHelpers.ts");




// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_2__["default"].extend({
    components: {
        Discipline: _components_SeriesApplicationDiscipline_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
        MemberSearchTakeover: _components_MemberSearch_MemberSearchTakeover_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Link to cart for series application
             */
            cart_link: '',
            /**
             * Whether the most recent action has completed successfully
             */
            confirmation_active: false,
            /**
             * Message to show in confirmation overlay
             */
            confirmation_message: '',
            /**
             * Whether the eligibility confirmation dialog is active
             */
            eligibility_confirmation_active: false,
            /**
             * Whether the application is being saved
             */
            is_saving: false,
            /**
             * Error resulting from application save
             */
            save_error: ''
        };
    },
    computed: {
        /**
         * The current user application for the series
         */
        application: function () {
            return this.$store.getters['series_registration/application/active_application'];
        },
        /**
         * Whether the pay button should be disabled
         */
        disable_pay: function () {
            return this.user_citizenship_ineligible || this.is_saving || this.total_cost <= 0;
        },
        /**
         * Whether the save button should be disabled
         */
        disable_save: function () {
            return this.is_saving || this.user_citizenship_ineligible;
        },
        /**
         * The disciplines within the application
         */
        disciplines: function () {
            if (this.application) {
                return this.application.disciplines;
            }
            return [];
        },
        /**
         * Levels information for the series
         */
        levels_information: function () {
            return (this.series && this.series.application_configuration.levels_information) || null;
        },
        /**
         * The text for the save button
         */
        save_button_text: function () {
            return this.is_saving ? 'Saving' : 'Save';
        },
        /**
         * The series for the page
         */
        series: function () {
            return this.$store.getters['series_registration/application/series'];
        },
        /**
         * Whether to show the refund information block
         */
        show_refund_information: function () {
            return this.$store.getters['series_registration/application/paid_level_exists'];
        },
        /**
         * The total cost of the active series application
         */
        total_cost: function () {
            return this.$store.getters['series_registration/application/total_cost'];
        },
        /**
         * Whether the active user is ineligible for the series due to their citizenship status
         */
        user_citizenship_ineligible: function () {
            return this.$store.getters['series_registration/application/user_citizenship_ineligible'];
        }
    },
    watch: {
        /**
         * Watch for confirmation active flag and play the animated check icon
         */
        confirmation_active: function (value) {
            var _this = this;
            if (value) {
                this.$nextTick(function () {
                    var check_icon = _this.$refs.check;
                    if (check_icon) {
                        check_icon.play();
                    }
                });
            }
        }
    },
    methods: {
        /**
         * Close the confirmation overlay
         */
        closeConfirmationOverlay: function () {
            this.confirmation_active = false;
            this.confirmation_message = '';
            this.save_error = '';
            this.cart_link = '';
            this.$store.commit('series_registration/application/setSavedApplicationExists', true);
        },
        /**
         * Handle continue event on eligibility confirmation
         */
        handleEligibilityConfirm: function () {
            this.eligibility_confirmation_active = false;
            this.saveApplication(true);
        },
        /**
         * Handle click event on pay now button
         */
        handlePayClick: function () {
            if (this.user_citizenship_ineligible) {
                return;
            }
            if (this.series && this.series.application_configuration.eligibility_documents.length) {
                this.eligibility_confirmation_active = true;
                return;
            }
            this.handleEligibilityConfirm();
        },
        /**
         * Close the member search
         */
        memberSearchClose: function () {
            this.$store.dispatch('series_registration/application/closeSearch');
        },
        /**
         *  Whether the member search is active
         */
        memberSearchIsActive: function () {
            return this.$store.getters['series_registration/application/member_search_active'];
        },
        /**
         * Whether the component overlay is active
         *
         * 1. Eligibility Confirmation
         * 2. Saving dialog
         * 3. Saved dialog
         * 4. Error dialog
         */
        overlayIsActive: function () {
            return this.is_saving || this.confirmation_active || !!this.save_error || this.eligibility_confirmation_active;
        },
        /**
         * Save the current application
         */
        saveApplication: function (is_pay) {
            var _this = this;
            if (is_pay === void 0) { is_pay = false; }
            if (this.user_citizenship_ineligible) {
                return;
            }
            this.is_saving = true;
            this.save_error = '';
            Object(_helpers_PromiseHelpers__WEBPACK_IMPORTED_MODULE_3__["enforcePromiseResolutionDuration"])(2000, this.$store.dispatch, ['series_registration/application/save'])
                .then(function (cart_link) {
                _this.is_saving = false;
                _this.confirmation_active = true;
                _this.confirmation_message = 'Your information has been saved';
                if (is_pay) {
                    _this.cart_link = cart_link;
                }
            })
                .catch(function (error_message) {
                _this.save_error = error_message;
                _this.is_saving = false;
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=script&lang=ts&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=script&lang=ts& ***!
  \***************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _components_SkateTests_SkateTests_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../components/SkateTests/SkateTests.vue */ "./src/js/components/SkateTests/SkateTests.vue");
/* harmony import */ var _components_SeriesApplicationProfileEmailEdit_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_components/SeriesApplicationProfileEmailEdit.vue */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue");



/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    components: {
        SeriesApplicationProfileEmailEdit: _components_SeriesApplicationProfileEmailEdit_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
        SkateTests: _components_SkateTests_SkateTests_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Key for active information window
             */
            active_info: false,
            /**
             * Whether the edit email form is active
             */
            edit_email_active: false
        };
    },
    computed: {
        /**
         * Default value when editing email
         */
        email_edit_initial_value: function () {
            return this.profile && this.profile.email ? this.profile.email : '';
        },
        /**
         * The profile for the active user
         */
        profile: function () {
            return this.$store.getters['series_registration/application/user_profile'];
        }
    },
    methods: {
        /**
         * Cancel the email edit field
         */
        closeEmailEdit: function () {
            this.edit_email_active = false;
        },
        /**
         * Open the email edit field
         */
        openEmailEdit: function () {
            this.edit_email_active = true;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    computed: {
        /**
         * The profile for the active user
         */
        profile: function () {
            return this.$store.state.series_registration.application.team_profile;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=script&lang=ts&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    filters: {
        /**
         * The class to apply to a level based on its payment status
         */
        level_class: function (value) {
            var modifier = value.is_paid ? 'paid' : 'unpaid';
            return "series-application-discipline__element__payment-status--" + modifier;
        },
        /**
         * The class to apply to a level icon based on the level payment status
         */
        level_icon_class: function (value) {
            var modifier = value.is_paid ? 'check' : 'x';
            return "icon-status-" + modifier;
        }
    },
    props: {
        discipline: {
            type: Object,
            required: true
        }
    },
    computed: {
        /**
         * The document associated with the discipline
         */
        document: function () {
            return this.$store.getters['series_registration/overview_discipline_document'](this.discipline.id);
        },
        /**
         * The currently added coaches
         */
        coaches: function () {
            return this.discipline.coaches;
        },
        /**
         * The currently added levels
         */
        levels: function () {
            return this.discipline.levels;
        },
        /**
         * The currently added partners
         */
        partners: function () {
            return this.discipline.partners;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=script&lang=ts&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=script&lang=ts& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    filters: {
        /**
         * The class to apply to a level based on its payment status
         */
        level_class: function (value) {
            var modifier = value.is_paid ? 'paid' : 'unpaid';
            return "series-application-discipline__element__payment-status--" + modifier;
        },
        /**
         * The class to apply to a level icon based on the level payment status
         */
        level_icon_class: function (value) {
            var modifier = value.is_paid ? 'check' : 'x';
            return "icon-status-" + modifier;
        }
    },
    props: {
        team: {
            type: Object,
            required: true
        }
    },
    computed: {
        /**
         * The document associated with the discipline
         */
        document: function () {
            return this.team.handbook;
        },
        /**
         * The currently added levels
         */
        levels: function () {
            return this.team.levels;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=script&lang=ts&":
/*!************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=script&lang=ts& ***!
  \************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * The application started, if any, for the series
         */
        application: {
            type: Object,
            required: false
        },
        /**
         * The series for the CTA
         */
        series: {
            type: Object,
            required: true
        }
    },
    computed: {
        /**
         * Text to show for application link button
         */
        application_button_text: function () {
            var application_started = !!this.application;
            return application_started ? 'Update My Application' : 'Start';
        },
        /**
         * Whether the application window is open
         */
        applications_open: function () {
            return this.series && this.series.status.applications_open;
        },
        /**
         * Whether to show the start/update button
         */
        show_application_button: function () {
            return this.applications_open;
        },
        /**
         * Whether to show the deadline element
         */
        show_deadline: function () {
            return this.applications_open;
        },
        /**
         * Whether to show the pay element
         */
        show_pay: function () {
            return this.applications_open && !!this.total_cost;
        },
        /**
         * Whether to show the standings element
         */
        show_standings: function () {
            return this.standings_available;
        },
        /**
         * Whether standings are available
         */
        standings_available: function () {
            return this.series && this.series.status.standings_available;
        },
        /**
         * The cost for unpaid application elements
         */
        total_cost: function () {
            return this.$store.getters['series_registration/application/total_cost'];
        }
    },
    /**
     * Emit event when mounted
     */
    mounted: function () {
        this.$emit('mounted');
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=script&lang=ts&":
/*!****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=script&lang=ts& ***!
  \****************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * The application started, if any, for the series
         */
        application_exists: {
            type: Boolean,
            required: false
        },
        /**
         * The series for the CTA
         */
        series: {
            type: Object,
            required: true
        }
    },
    computed: {
        /**
         * Text to show for application link button
         */
        application_button_text: function () {
            return this.application_exists ? 'Start/Update Application' : 'Start Application';
        },
        /**
         * Whether the application window is open
         */
        applications_open: function () {
            return this.series && this.series.status.applications_open;
        },
        /**
         * Whether to show the start/update button
         */
        show_application_button: function () {
            return this.applications_open;
        },
        /**
         * Whether to show the deadline element
         */
        show_deadline: function () {
            return this.applications_open;
        },
        /**
         * Whether to show the standings element
         */
        show_standings: function () {
            return this.standings_available;
        },
        /**
         * Whether standings are available
         */
        standings_available: function () {
            return this.series && this.series.status.standings_available;
        }
    },
    /**
     * Emit event when mounted
     */
    mounted: function () {
        this.$emit('mounted');
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _store_SeriesRegistrationState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_store/SeriesRegistrationState */ "./src/js/SeriesRegistration/_store/SeriesRegistrationState.ts");
/* harmony import */ var _components_SeriesOverviewCta_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_components/SeriesOverviewCta.vue */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue");
/* harmony import */ var _components_SeriesOverviewApplicationDiscipline_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_components/SeriesOverviewApplicationDiscipline.vue */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue");
/* harmony import */ var _components_SeriesOverviewApplicationTeam_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_components/SeriesOverviewApplicationTeam.vue */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue");
/* harmony import */ var _components_SeriesOverviewTeamCta_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_components/SeriesOverviewTeamCta.vue */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue");







var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__["default"])(_mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    components: {
        SeriesOverviewApplicationDiscipline: _components_SeriesOverviewApplicationDiscipline_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
        SeriesOverviewApplicationTeam: _components_SeriesOverviewApplicationTeam_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
        SeriesOverviewCta: _components_SeriesOverviewCta_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
        SeriesOverviewTeamCta: _components_SeriesOverviewTeamCta_vue__WEBPACK_IMPORTED_MODULE_6__["default"]
    },
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * Data dependencies required for component
             */
            dependencies: {
                series: false
            },
            eligibility_confirmation_active: false,
            /**
             * Amount of bottom padding to add to page to account for fixed footer
             */
            page_bottom_padding: 0,
            pay_confirmation_active: false
        };
    },
    computed: {
        /**
         * Whether an individual user has started an application, or if a team manager has a team with an active application
         */
        application_exists: function () {
            return !!this.user_application || this.team_application_exists;
        },
        /**
         * Whether a team application has been started
         */
        team_application_exists: function () {
            return this.applied_teams ? !!this.applied_teams.teams.length : false;
        },
        /**
         * The teams with a started application for the series
         */
        applied_teams: function () {
            return this.$store.state.series_registration.application.applied_teams;
        },
        /**
         * The configuration for the page header
         */
        page_header: function () {
            var conf = {
                title: 'Series Overview'
            };
            if (this.series) {
                conf.back_link = this.series.links.series_list;
                conf.back_link_label = 'Back to Series Information';
            }
            return conf;
        },
        /**
         * Additional style properties to apply to the page element
         */
        page_style: function () {
            if (this.page_bottom_padding) {
                return {
                    paddingBottom: this.page_bottom_padding + "px"
                };
            }
            return null;
        },
        /**
         * Whether a paid level exists for the active user application
         */
        paid_level_exists: function () {
            return this.$store.getters['series_registration/application/paid_level_exists'];
        },
        /**
         * The series for the page
         */
        series: function () {
            return this.$store.state.series_registration.overview_series;
        },
        /**
         * Whether to show the footer (CTA)
         */
        show_footer: function () {
            return this.series && (this.series.status.applications_open || this.series.status.standings_available);
        },
        /**
         * Whether to show the refund contact link
         */
        show_refund_contact: function () {
            return this.paid_level_exists;
        },
        /**
         * The status message for the series
         */
        status_message: function () {
            return this.series && this.series.status && this.series.status.message;
        },
        /**
         * The active user's application for the series
         */
        user_application: function () {
            return this.$store.state.series_registration.application.user_application;
        }
    },
    /**
     * Upon mounted, attach debounced resize listener
     */
    mounted: function () {
        var _this = this;
        var window_resize_timeout;
        window.addEventListener('resize', function () {
            if (window_resize_timeout) {
                clearTimeout(window_resize_timeout);
            }
            window_resize_timeout = window.setTimeout(function () {
                _this.updatePageFooterOffset();
            }, 150);
        });
    },
    /**
     * Before component created, ensure state modules are registered and configured
     */
    beforeCreate: function () {
        if (typeof this.$store.state.series_registration === 'undefined') {
            this.$store.registerModule('series_registration', _store_SeriesRegistrationState__WEBPACK_IMPORTED_MODULE_2__["SeriesRegistrationState"]);
        }
    },
    methods: {
        /**
         * Handle confirmation of eligibility requirements
         */
        handleEligibilityConfirm: function () {
            window.location.assign(this.series.links.checkout);
        },
        /**
         *  Handle the click event on the CTA pay button
         */
        handlePayAttempt: function () {
            this.pay_confirmation_active = true;
        },
        /**
         * Load data dependencies
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('series_registration/fetchSeriesOverview')
                    .then(function () {
                    _this.dependencies.series = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        },
        /**
         * Whether overlay is active
         */
        overlayIsActive: function () {
            return this.pay_confirmation_active || this.eligibility_confirmation_active;
        },
        /**
         * Update page bottom padding to account for fixed footer
         */
        updatePageFooterOffset: function () {
            var footer_offset = 0;
            var footer = this.$refs.footer;
            if (footer) {
                footer_offset = footer.offsetHeight || footer.clientHeight;
            }
            this.page_bottom_padding = footer_offset + 30;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * Whether there has been an attempt to apply filters
             */
            apply_attempt: false,
            /**
             * Locally-selected discipline filter
             */
            discipline_filter: [],
            /**
             * Locally-selected level filter
             */
            level_filter: [],
            /**
             * Locally-selected section filter
             */
            section_filter: []
        };
    },
    computed: {
        /**
         * The current active global filters
         */
        active_global_filters: function () {
            return this.$store.state.series_standings.active_global_filters;
        },
        /**
         * The current available global filters
         */
        available_global_filters: function () {
            return this.$store.state.series_standings.available_global_filters;
        },
        /**
         * The payload when reporting changes to state
         */
        state_payload: function () {
            return {
                sections: this.section_filter,
                disciplines: this.discipline_filter,
                levels: this.level_filter
            };
        },
        /**
         * Whether the currently selected filter set is valid
         */
        valid: function () {
            return !this.validation_error;
        },
        /**
         * The validation error for the current state of the component
         */
        validation_error: function () {
            var missing_fields = [];
            if (this.discipline_filter.length === 0) {
                missing_fields.push('discipline');
            }
            if (this.level_filter.length === 0) {
                missing_fields.push('level');
            }
            if (this.section_filter.length === 0) {
                missing_fields.push('section');
            }
            if (missing_fields.length) {
                if (missing_fields.length === 1) {
                    return "Select at least one " + missing_fields[0] + ".";
                }
                var last = missing_fields.pop();
                return "Select at least one " + missing_fields.join(', ') + " and " + last + ".";
            }
            return null;
        }
    },
    /**
     * On component creation, reflect active filters in state locally
     */
    created: function () {
        this.section_filter = this.active_global_filters.sections.slice();
        this.discipline_filter = this.active_global_filters.disciplines.slice();
        this.level_filter = this.active_global_filters.levels.slice();
    },
    methods: {
        /**
         * Apply the selected filters
         */
        apply: function () {
            this.apply_attempt = true;
            if (!this.valid) {
                return;
            }
            this.$store.commit('series_standings/setActiveGlobalFilters', this.state_payload);
            this.$emit('close');
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _SeriesStandingsConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../SeriesStandingsConstants */ "./src/js/SeriesRegistration/SeriesStandings/SeriesStandingsConstants.ts");


/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * The options available for the filter field
             */
            field_options: _SeriesStandingsConstants__WEBPACK_IMPORTED_MODULE_1__["SeriesStandingsConstants"].GRANULAR_FILTER_FIELD_OPTIONS,
            /**
             * The selected field_option to filter against
             */
            filter_field: null,
            /**
             * The currently entered filter term
             */
            filter_term: [null, null]
        };
    },
    computed: {
        /**
         * The placeholder for the filter input
         */
        input_placeholder: function () {
            if (this.filter_field) {
                return 'Enter ' + this.filter_field.label;
            }
            return '';
        }
    },
    watch: {
        /**
         * Clear the filter term when the field changes
         */
        filter_field: function () {
            this.filter_term = [null, null];
        },
        /**
         * Watch the filter term for change, and report the filter to state
         */
        filter_term: {
            /**
             * Compile filter and report to state
             */
            handler: function (value) {
                var primary_value = null;
                var secondary_value = null;
                var primary_segment = value[0];
                var secondary_segment = value[1];
                if (primary_segment) {
                    primary_value = primary_segment.trim() || null;
                }
                if (secondary_segment) {
                    secondary_value = secondary_segment.trim() || null;
                }
                var compiled_filter = {
                    field: this.filter_field,
                    term: [primary_value, secondary_value]
                };
                this.$store.commit('series_standings/updateGranularFilter', compiled_filter);
            },
            deep: true
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _StandingsTableItem_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StandingsTableItem.vue */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue");


var uid = 1;
/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    components: { StandingsTableItem: _StandingsTableItem_vue__WEBPACK_IMPORTED_MODULE_1__["default"] },
    props: {
        event_name: {
            type: String,
            required: true
        },
        standings: {
            type: Array,
            required: true
        }
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            uid: uid++,
            show_expanded_content: false
        };
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=script&lang=ts&":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=script&lang=ts& ***!
  \**************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    filters: {
        /**
         * Format a rank/score. If a value is present, return it.  Otherwise return an em-dash
         */
        nullable_rank_score: function (value) {
            if (value === null) {
                return 'N/A';
            }
            return value;
        }
    },
    props: {
        /**
         * Whether to show additional content
         */
        show_expanded_content: {
            type: Boolean,
            required: true
        },
        /**
         * Data for the standings item
         */
        standing: {
            type: Object,
            required: true
        }
    },
    computed: {
        /**
         * The class to apply to the badge element
         */
        badge_class: function () {
            var parsed = parseInt(String(this.standing.sectional_rank));
            if (!isNaN(parsed) && parsed <= 6) {
                return null;
            }
            return 'standings-item-badge--inverted';
        },
        /**
         * The class to apply to the secondary aspect of the badge
         */
        badge_secondary_class: function () {
            var map = {
                eastern: '--primary',
                pacific: '--secondary',
                midwestern: '--tertiary'
            };
            var modifier = map[this.standing.section_key];
            return "standings-item-badge__secondary" + modifier;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _store_SeriesStandingsState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_store/SeriesStandingsState */ "./src/js/SeriesRegistration/SeriesStandings/_store/SeriesStandingsState.ts");
/* harmony import */ var _components_StandingsTable_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_components/StandingsTable.vue */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue");
/* harmony import */ var _mixins_HasPaginatedItems__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../mixins/HasPaginatedItems */ "./src/js/mixins/HasPaginatedItems.ts");
/* harmony import */ var _components_StandingsGranularFilter_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_components/StandingsGranularFilter.vue */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue");
/* harmony import */ var _components_StandingsGlobalFilter_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_components/StandingsGlobalFilter.vue */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue");







var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__["default"])(_mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__["default"], _mixins_HasPaginatedItems__WEBPACK_IMPORTED_MODULE_4__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    components: {
        StandingsGlobalFilter: _components_StandingsGlobalFilter_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
        StandingsGranularFilter: _components_StandingsGranularFilter_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
        StandingsTable: _components_StandingsTable_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
    },
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * The indices of the actively-expanded accordion
             */
            active_accordion_indices: [],
            /**
             * Data dependencies required for component
             */
            dependencies: {
                series: false
            },
            /**
             * Whether global filters are active
             */
            global_filters_active: false,
            /**
             * The amount of items per page of pagination
             */
            pagination_per_page: 50
        };
    },
    computed: {
        /**
         * The configuration for the page header
         */
        page_header: function () {
            var conf = {
                title: 'Standings'
            };
            if (this.series) {
                conf.back_link = this.series.links.overview;
                conf.back_link_label = 'Back to Series Overview';
            }
            return conf;
        },
        /**
         * The items to paginate
         */
        pagination_items: function () {
            return this.events;
        },
        /**
         * Resource documents for the series standings
         */
        resource_documents: function () {
            return this.series ? this.series.resource_documents : [];
        },
        /**
         * The series for the page
         */
        series: function () {
            return this.$store.state.series_standings.series;
        },
        /**
         * Formatted string indicating when standings were last updated
         */
        standings_last_updated: function () {
            return this.$store.getters['series_standings/standings_last_updated'];
        },
        /**
         * The list of standings events for display on the page
         */
        events: function () {
            return this.$store.getters['series_standings/display_events'];
        }
    },
    /**
     * Before creation, ensure state modules registered
     */
    beforeCreate: function () {
        if (typeof this.$store.state.standings === 'undefined') {
            this.$store.registerModule('series_standings', _store_SeriesStandingsState__WEBPACK_IMPORTED_MODULE_2__["SeriesStandingsState"]);
        }
    },
    methods: {
        /**
         * Whether an accordion is open
         */
        accordionOpen: function (uid) {
            return this.active_accordion_indices.indexOf(uid) !== -1;
        },
        /**
         * Handle the toggle event on an accordion in the accordion list
         */
        handleAccordionToggle: function (uid) {
            var indices_index = this.active_accordion_indices.indexOf(uid);
            if (indices_index !== -1) {
                this.active_accordion_indices.splice(indices_index, 1);
                return;
            }
            this.active_accordion_indices.push(uid);
        },
        /**
         * Load data dependencies
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('series_standings/fetchSeriesStandings')
                    .then(function () {
                    _this.dependencies.series = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        series: {
            type: Object,
            required: true
        }
    },
    /**
     * Upon creation, update app navbar state to accommodate header
     */
    created: function () {
        this.$store.commit('app/removeNavBorder');
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * The eligibility documents for the series
         */
        eligibility_documents: {
            type: Array,
            required: true
        }
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            confirmed: false
        };
    },
    computed: {
        /**
         * Whether the button should be disabled
         */
        disable_button: function () {
            return !this.confirmed;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=script&lang=ts&":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=script&lang=ts& ***!
  \**************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _store_SeriesRegistrationState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_store/SeriesRegistrationState */ "./src/js/SeriesRegistration/_store/SeriesRegistrationState.ts");



var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__["default"])(_mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    props: {
        /**
         * The back link url to display in the page header
         */
        back_link: {
            type: String,
            required: false
        },
        /**
         * The label for the back link in the page header
         */
        back_link_label: {
            type: String,
            required: false
        }
    },
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * Data dependencies required for component
             */
            dependencies: {
                series_list: false
            }
        };
    },
    computed: {
        /**
         * The configuration for the page header
         */
        page_header: function () {
            var title = 'Series Information';
            return {
                title: title,
                back_link: this.back_link,
                back_link_label: this.back_link_label
            };
        },
        /**
         * The list of series items to display in the page
         */
        series_list: function () {
            return this.$store.state.series_registration.series_list;
        }
    },
    /**
     * Before component created, ensure skater series state module is registered
     */
    beforeCreate: function () {
        if (typeof this.$store.state.series_registration === 'undefined') {
            this.$store.registerModule('series_registration', _store_SeriesRegistrationState__WEBPACK_IMPORTED_MODULE_2__["SeriesRegistrationState"]);
        }
    },
    methods: {
        /**
         * Load data dependencies
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('series_registration/fetchSeriesList')
                    .then(function () {
                    _this.dependencies.series_list = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _Teams_components_SelectTeamList_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Teams/_components/SelectTeamList.vue */ "./src/js/Teams/_components/SelectTeamList.vue");
/* harmony import */ var _store_SeriesRegistrationState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_store/SeriesRegistrationState */ "./src/js/SeriesRegistration/_store/SeriesRegistrationState.ts");




var extendedVue = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__["default"])(_mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (extendedVue.extend({
    components: {
        SelectTeamList: _Teams_components_SelectTeamList_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Data dependencies for component to load
             */
            dependencies: {
                teams: false
            },
            /**
             * Title to display for the page in the header block
             */
            page_title: 'Select a Team'
        };
    },
    computed: {
        /**
         * The series for the page
         */
        series: function () {
            return this.$store.state.series_registration.series_summary;
        },
        /**
         * The configuration for the page header
         */
        page_header: function () {
            var conf = {
                title: this.page_title
            };
            if (this.series) {
                conf.back_link = this.series.links.overview;
                conf.back_link_label = 'Back to Series Overview';
            }
            return conf;
        },
        /**
         * The teams to display on the page
         */
        teams: function () {
            return this.$store.state.series_registration.selectable_teams;
        }
    },
    /**
     * Before component created, ensure state modules are registered and configured
     */
    beforeCreate: function () {
        if (typeof this.$store.state.series_registration === 'undefined') {
            this.$store.registerModule('series_registration', _store_SeriesRegistrationState__WEBPACK_IMPORTED_MODULE_3__["SeriesRegistrationState"]);
        }
    },
    methods: {
        /**
         * Load data dependencies for component
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('series_registration/fetchSeriesTeamSelect')
                    .then(function () {
                    _this.dependencies.teams = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * The teams to display in the list
         */
        teams: {
            type: Array,
            required: true
        }
    },
    methods: {
        /**
         * Handle the select event on a team
         */
        selectTeam: function (team) {
            this.$emit('select', team);
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _store_Modules_MemberSearchState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../store/Modules/MemberSearchState */ "./src/js/store/Modules/MemberSearchState.ts");
/* harmony import */ var _services_MemberSearchService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/MemberSearchService */ "./src/js/services/MemberSearchService.ts");



/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        use_defaults: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        /**
         * The entity name for the component heading
         */
        heading_entity: function () {
            return this.$store.state.member_search.entity_descriptor;
        },
        /**
         * Whether the member search results are active
         */
        results_active: function () {
            return this.$store.state.member_search.results_active;
        }
    },
    /**
     * Before creation, ensure state module exists
     */
    beforeCreate: function () {
        if (typeof this.$store.state.member_search === 'undefined') {
            this.$store.registerModule('member_search', _store_Modules_MemberSearchState__WEBPACK_IMPORTED_MODULE_1__["MemberSearchState"]);
        }
    },
    /**
     * Upon creation, configure member search state using default generics
     */
    created: function () {
        if (this.use_defaults) {
            this.$store.commit('member_search/configure', {
                search_function: _services_MemberSearchService__WEBPACK_IMPORTED_MODULE_2__["MemberSearchService"].memberSearch,
                selection_method: this.selectResult,
                close_method: this.close,
                entity_descriptor: 'Member',
                result_validators: [],
                form_validators: []
            });
        }
    },
    methods: {
        /**
         * Close the member search
         */
        memberSearchClose: function () {
            this.$emit('close');
        },
        /**
         * Generic select result handler.  Emit selection and close
         */
        selectResult: function (result) {
            var _this = this;
            return new Promise(function (resolve) {
                _this.$emit('result-selected', result);
                _this.close();
                resolve();
            });
        },
        /**
         * Generic close.  Emit close event
         */
        close: function () {
            this.$emit('close');
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/SkateTests/SkateTests.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/SkateTests/SkateTests.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* ===========================================================================================================
*                                              2020-03-08 SKATE TESTS COMPONENT
* Full component for handling skate tests, including history display and edit discipline overlay
* ===========================================================================================================*/

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        club_autosuggest_configuration: {
            type: Object,
            required: false,
            default: function () {
                return {
                    active: true,
                    restrict: false
                };
            }
        }
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Whether a test is in the process of being submitted
             */
            submitting_test: false,
            /**
             * Error message resulting from a submission
             */
            test_submit_error: null
        };
    },
    computed: {
        /**
         * The currently active discipline on state
         */
        active_discipline: function () {
            return this.$store.getters['skate_test_history/active_discipline'];
        },
        /**
         * Form options for test for the active form instance
         */
        active_test_options: function () {
            return this.$store.getters['skate_test_history/active_discipline_test_options'];
        },
        /**
         * The title of the skate test overlay
         */
        takeover_title: function () {
            if (this.active_discipline) {
                return "Add " + this.active_discipline.label;
            }
            return '';
        }
    },
    methods: {
        /**
         * Close the overlay
         */
        closeOverlay: function () {
            if (this.submitting_test) {
                return;
            }
            this.test_submit_error = null;
            this.$store.commit('skate_test_history/setActiveDiscipline', null);
        },
        /**
         * Respond to completion event on skate test discipline form.
         *  - Submit information
         *  - Close form
         *  Log error on submission failure
         */
        completeSkateTest: function (test_data) {
            var _this = this;
            this.submitting_test = true;
            this.test_submit_error = null;
            this.$store.dispatch('skate_test_history/saveTest', test_data)
                .then(function () {
                _this.$store.commit('skate_test_history/setActiveDiscipline', null);
                _this.submitting_test = false;
            })
                .catch(function (error_message) {
                _this.submitting_test = false;
                _this.test_submit_error = error_message;
            });
        },
        /**
         * Whether the overlay is active
         */
        overlayActive: function () {
            return !!this.active_discipline;
        }
    }
}));


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=template&id=c70b31b6&":
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=template&id=c70b31b6& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", [
    _c("p", [
      _vm._v(
        "\n        You are not eligible to register for the " +
          _vm._s(_vm.series.name) +
          " at this time due to your\n        citizenship\n        status.\n    "
      )
    ]),
    _vm._v(" "),
    _vm._m(0)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", [
      _vm._v("\n        Please email\n        "),
      _c("br"),
      _vm._v(" "),
      _c(
        "a",
        {
          staticClass: "standard-link",
          attrs: { href: "mailto:MemberServices@usfigureskating.org" }
        },
        [_vm._v("MemberServices@usfigureskating.org\n        ")]
      ),
      _vm._v(" "),
      _c("br"),
      _vm._v("\n        for more information.\n    ")
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=template&id=5b638a37&":
/*!**************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=template&id=5b638a37& ***!
  \**************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "series-application-discipline" }, [
    _c("h3", { staticClass: "series-application-discipline__name" }, [
      _vm._v("\n        " + _vm._s(_vm.discipline.name) + "\n    ")
    ]),
    _vm._v(" "),
    _vm.show_section_partner
      ? _c("div", { staticClass: "series-application-discipline__section" }, [
          _c(
            "h4",
            { staticClass: "series-application-discipline__section-name" },
            [_vm._v("\n            Partner\n        ")]
          ),
          _vm._v(" "),
          _vm.notice_partner
            ? _c(
                "div",
                {
                  staticClass: "series-application-discipline__section-notice"
                },
                [
                  _c("p", { class: "text--icon-" + _vm.notice_partner.type }, [
                    _vm._v(
                      "\n                " +
                        _vm._s(_vm.notice_partner.message) +
                        "\n            "
                    )
                  ])
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.partners.length
            ? _c(
                "ul",
                { staticClass: "series-application-discipline__element-list" },
                _vm._l(_vm.partners, function(partner) {
                  return _c("li", { key: partner.id }, [
                    _c(
                      "div",
                      { staticClass: "series-application-discipline__element" },
                      [
                        _c(
                          "div",
                          {
                            staticClass:
                              "series-application-discipline__element__label"
                          },
                          [
                            _vm._v(
                              "\n                        " +
                                _vm._s(partner.first_name) +
                                " " +
                                _vm._s(partner.last_name) +
                                "\n                        "
                            ),
                            partner.ineligible
                              ? _c("span", { staticClass: "text--error" }, [
                                  _vm._v("(Ineligible)")
                                ])
                              : _vm._e()
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass:
                              "series-application-discipline__element__action"
                          },
                          [
                            _c(
                              "button",
                              {
                                staticClass:
                                  "icon-button icon-button--md icon-button--delete icon-button--pseudo",
                                attrs: {
                                  disabled: _vm.paid_level_exists,
                                  title: "Remove Partner " + partner.name
                                },
                                on: {
                                  click: function($event) {
                                    $event.preventDefault()
                                    _vm.partnerRemove(partner)
                                  }
                                }
                              },
                              [
                                _c("span", { staticClass: "sr-only" }, [
                                  _vm._v(
                                    "Remove Partner " + _vm._s(partner.name)
                                  )
                                ])
                              ]
                            )
                          ]
                        )
                      ]
                    )
                  ])
                })
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.show_partner_add
            ? _c(
                "div",
                { staticClass: "series-application-discipline__section__add" },
                [
                  _c(
                    "div",
                    { staticClass: "series-application-discipline__element" },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__placeholder"
                        },
                        [
                          _vm._v(
                            "\n                    Add Partner\n                "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__action"
                        },
                        [
                          _c(
                            "button",
                            {
                              staticClass:
                                "icon-button icon-button--lg icon-button--add icon-button--pseudo",
                              on: {
                                click: function($event) {
                                  $event.preventDefault()
                                  _vm.partnerAdd()
                                }
                              }
                            },
                            [
                              _c("span", { staticClass: "sr-only" }, [
                                _vm._v("Add Partner")
                              ])
                            ]
                          )
                        ]
                      )
                    ]
                  )
                ]
              )
            : _vm._e()
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.show_section_levels
      ? _c("div", { staticClass: "series-application-discipline__section" }, [
          _c(
            "h4",
            { staticClass: "series-application-discipline__section-name" },
            [_vm._v("\n            Levels\n        ")]
          ),
          _vm._v(" "),
          _vm.notice_levels
            ? _c(
                "div",
                {
                  staticClass: "series-application-discipline__section-notice"
                },
                [
                  _c("p", { class: "text--icon-" + _vm.notice_levels.type }, [
                    _vm._v(
                      "\n                " +
                        _vm._s(_vm.notice_levels.message) +
                        "\n            "
                    )
                  ])
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.levels.length
            ? _c(
                "ul",
                { staticClass: "series-application-discipline__element-list" },
                _vm._l(_vm.levels, function(level) {
                  return _c("li", { key: level.id }, [
                    _c(
                      "div",
                      {
                        staticClass: "series-application-discipline__element",
                        class: _vm.level_element_class(level)
                      },
                      [
                        _c(
                          "div",
                          {
                            staticClass:
                              "series-application-discipline__element__label"
                          },
                          [
                            _vm._v(
                              "\n                        " +
                                _vm._s(level.name) +
                                "\n                    "
                            )
                          ]
                        ),
                        _vm._v(" "),
                        !level.is_paid
                          ? _c(
                              "div",
                              {
                                staticClass:
                                  "series-application-discipline__element__action"
                              },
                              [
                                _c(
                                  "button",
                                  {
                                    staticClass:
                                      "icon-button icon-button--md icon-button--delete icon-button--pseudo",
                                    attrs: { title: "Remove " + level.name },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.levelRemove(level)
                                      }
                                    }
                                  },
                                  [
                                    _c("span", { staticClass: "sr-only" }, [
                                      _vm._v(
                                        "Remove Level " + _vm._s(level.name)
                                      )
                                    ])
                                  ]
                                )
                              ]
                            )
                          : _c(
                              "div",
                              {
                                staticClass:
                                  "series-application-discipline__element__payment-status series-application-discipline__element__payment-status--paid"
                              },
                              [
                                _c(
                                  "span",
                                  {
                                    staticClass:
                                      "series-application-discipline__element__payment-status__text"
                                  },
                                  [
                                    _vm._v(
                                      "\n                            Paid\n                        "
                                    )
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "i",
                                  {
                                    staticClass:
                                      "series-application-discipline__element__payment-status__icon icon-status-check"
                                  },
                                  [
                                    _vm._v(
                                      "\n                             \n                        "
                                    )
                                  ]
                                )
                              ]
                            )
                      ]
                    ),
                    _vm._v(" "),
                    !level.is_paid && _vm.show_level_payment_status
                      ? _c(
                          "div",
                          {
                            staticClass:
                              "series-application-discipline__element-label"
                          },
                          [
                            _vm._v(
                              "\n                    Unpaid level\n                "
                            )
                          ]
                        )
                      : _vm._e()
                  ])
                })
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "series-application-discipline__section__add" },
            [
              _vm.show_level_select
                ? _c(
                    "div",
                    {
                      staticClass:
                        "series-application-discipline__element form-group"
                    },
                    [
                      _c(
                        "select",
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.level_select_value,
                              expression: "level_select_value"
                            }
                          ],
                          staticClass: "form-field",
                          attrs: { id: "level", name: "level" },
                          on: {
                            change: function($event) {
                              var $$selectedVal = Array.prototype.filter
                                .call($event.target.options, function(o) {
                                  return o.selected
                                })
                                .map(function(o) {
                                  var val = "_value" in o ? o._value : o.value
                                  return val
                                })
                              _vm.level_select_value = $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            }
                          }
                        },
                        [
                          _c("option", { domProps: { value: null } }, [
                            _vm._v(
                              "\n                        Select Level\n                    "
                            )
                          ]),
                          _vm._v(" "),
                          _vm._l(_vm.levels_selectable, function(level, index) {
                            return _c(
                              "option",
                              { key: index, domProps: { value: level } },
                              [
                                _vm._v(
                                  "\n                        " +
                                    _vm._s(level.name) +
                                    "\n                    "
                                )
                              ]
                            )
                          })
                        ],
                        2
                      )
                    ]
                  )
                : _vm.show_level_add
                ? _c(
                    "div",
                    { staticClass: "series-application-discipline__element" },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__placeholder"
                        },
                        [
                          _vm._v(
                            "\n                    Add Level\n                "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__action"
                        },
                        [
                          _c(
                            "button",
                            {
                              staticClass:
                                "icon-button icon-button--lg icon-button--add icon-button--pseudo",
                              on: {
                                click: function($event) {
                                  $event.preventDefault()
                                  _vm.levelAdd()
                                }
                              }
                            },
                            [
                              _c("span", { staticClass: "sr-only" }, [
                                _vm._v("Add Level")
                              ])
                            ]
                          )
                        ]
                      )
                    ]
                  )
                : _vm._e()
            ]
          )
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.show_section_coaches
      ? _c("div", { staticClass: "series-application-discipline__section" }, [
          _c(
            "h4",
            { staticClass: "series-application-discipline__section-name" },
            [_vm._v("\n            Coaches\n        ")]
          ),
          _vm._v(" "),
          _vm.notice_coaches
            ? _c(
                "div",
                {
                  staticClass: "series-application-discipline__section-notice"
                },
                [
                  _c("p", { class: "text--icon-" + _vm.notice_coaches.type }, [
                    _vm._v(
                      "\n                " +
                        _vm._s(_vm.notice_coaches.message) +
                        "\n            "
                    )
                  ])
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.coaches.length
            ? _c(
                "ul",
                { staticClass: "series-application-discipline__element-list" },
                _vm._l(_vm.coaches, function(coach) {
                  return _c("li", { key: coach.id }, [
                    _c(
                      "div",
                      { staticClass: "series-application-discipline__element" },
                      [
                        _c(
                          "div",
                          {
                            staticClass:
                              "series-application-discipline__element__label"
                          },
                          [
                            _vm._v(
                              "\n                        " +
                                _vm._s(coach.first_name) +
                                " " +
                                _vm._s(coach.last_name) +
                                "\n                        "
                            ),
                            coach.ineligible
                              ? _c("span", { staticClass: "text--error" }, [
                                  _vm._v("(Ineligible)")
                                ])
                              : _vm._e()
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass:
                              "series-application-discipline__element__action"
                          },
                          [
                            _c(
                              "button",
                              {
                                staticClass:
                                  "icon-button icon-button--md icon-button--delete icon-button--pseudo",
                                attrs: { title: "Remove Coach " + coach.name },
                                on: {
                                  click: function($event) {
                                    $event.preventDefault()
                                    _vm.coachRemove(coach)
                                  }
                                }
                              },
                              [
                                _c("span", { staticClass: "sr-only" }, [
                                  _vm._v("Remove Coach " + _vm._s(coach.name))
                                ])
                              ]
                            )
                          ]
                        )
                      ]
                    )
                  ])
                })
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.show_coach_add
            ? _c(
                "div",
                { staticClass: "series-application-discipline__section__add" },
                [
                  _c(
                    "div",
                    { staticClass: "series-application-discipline__element" },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__placeholder"
                        },
                        [
                          _vm._v(
                            "\n                    Add Coach\n                "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__action"
                        },
                        [
                          _c(
                            "button",
                            {
                              staticClass:
                                "icon-button icon-button--lg icon-button--add icon-button--pseudo",
                              on: {
                                click: function($event) {
                                  $event.preventDefault()
                                  _vm.coachAdd()
                                }
                              }
                            },
                            [
                              _c("span", { staticClass: "sr-only" }, [
                                _vm._v("Add Coach")
                              ])
                            ]
                          )
                        ]
                      )
                    ]
                  )
                ]
              )
            : _vm._e()
        ])
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=template&id=0a13d43b&":
/*!****************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=template&id=0a13d43b& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", [
    _c("p", [
      _vm._v(
        "\n        The selected person is not eligible to register for the " +
          _vm._s(_vm.series.name) +
          " at this time due to citizenship\n        status.\n    "
      )
    ]),
    _vm._v(" "),
    _vm._m(0)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", [
      _vm._v("\n        Please email\n        "),
      _c("br"),
      _vm._v(" "),
      _c(
        "a",
        {
          staticClass: "standard-link",
          attrs: { href: "mailto:MemberServices@usfigureskating.org" }
        },
        [_vm._v("MemberServices@usfigureskating.org\n        ")]
      ),
      _vm._v(" "),
      _c("br"),
      _vm._v("\n        for more information.\n    ")
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=template&id=f125d5b8&":
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=template&id=f125d5b8& ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "series-application-profile-email-edit" }, [
    _c("div", { staticClass: "form-group", class: _vm.fieldClass("email") }, [
      _c("label", { staticClass: "sr-only", attrs: { for: "email" } }, [
        _vm._v("Email Address\n        ")
      ]),
      _vm._v(" "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.form_data.email,
            expression: "form_data.email"
          }
        ],
        staticClass: "form-field",
        attrs: { id: "email", type: "text", name: "email" },
        domProps: { value: _vm.form_data.email },
        on: {
          keydown: function($event) {
            if (
              !("button" in $event) &&
              _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
            ) {
              return null
            }
            return _vm.attemptSave($event)
          },
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.$set(_vm.form_data, "email", $event.target.value)
          }
        }
      }),
      _vm._v(" "),
      _vm.fieldMessage("email")
        ? _c("p", { staticClass: "input-error" }, [
            _vm._v(
              "\n            *" +
                _vm._s(_vm.fieldMessage("email")) +
                "\n        "
            )
          ])
        : _vm._e()
    ]),
    _vm._v(" "),
    _vm.submit_error
      ? _c("p", { staticClass: "input-error" }, [
          _vm._v("\n        " + _vm._s(_vm.submit_error) + "\n    ")
        ])
      : _vm._e(),
    _vm._v(" "),
    _c("div", { staticClass: "form-row" }, [
      _c("div", { staticClass: "form-column" }, [
        _c(
          "button",
          {
            staticClass: "button button--block button--medium button--info",
            attrs: { disabled: _vm.is_submitting },
            on: {
              click: function($event) {
                $event.preventDefault()
                _vm.$emit("close")
              }
            }
          },
          [_vm._v("\n                Cancel\n            ")]
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "form-column" }, [
        _c(
          "button",
          {
            staticClass: "button button--block button--medium",
            attrs: { disabled: _vm.is_submitting },
            on: {
              click: function($event) {
                $event.preventDefault()
                return _vm.attemptSave($event)
              }
            }
          },
          [
            _vm._v(
              "\n                " +
                _vm._s(!_vm.is_submitting ? "Save" : "Saving") +
                "\n            "
            )
          ]
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=template&id=02d84974&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=template&id=02d84974& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "series-registration-application-page" },
    [
      _c(
        "page",
        {
          class: { "page--accent": _vm.component_loaded },
          attrs: { header: _vm.page_header }
        },
        [
          _vm.component_loaded
            ? _c("series-page-header", {
                attrs: { slot: "pre-header", series: _vm.series },
                slot: "pre-header"
              })
            : _vm._e(),
          _vm._v(" "),
          !_vm.component_loaded
            ? _c("component-loader", {
                attrs: {
                  slot: "loader",
                  container: true,
                  source: this,
                  error_message: "Error loading series application."
                },
                slot: "loader"
              })
            : _c(
                "div",
                {
                  staticClass: "series-registration-application-page__content"
                },
                [
                  _c(
                    "div",
                    {
                      staticClass:
                        "series-registration-application-page__tabs page--accent__standard-content"
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "tabs tabs--justified tabs--equal tabs--reduced"
                        },
                        [
                          _c("div", { staticClass: "tabs__triggers" }, [
                            _c("ul", { staticClass: "tabs__list" }, [
                              _c("li", { staticClass: "tabs__item" }, [
                                _c(
                                  "a",
                                  {
                                    staticClass: "tabs__trigger",
                                    class: {
                                      active: _vm.active_view === "profile"
                                    },
                                    attrs: {
                                      href:
                                        "#series-registration-application-page-tab-body"
                                    },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.selectActiveView("profile")
                                      }
                                    }
                                  },
                                  [
                                    _vm._v(
                                      "\n                                    Profile\n                                "
                                    )
                                  ]
                                )
                              ]),
                              _vm._v(" "),
                              _c("li", { staticClass: "tabs__item" }, [
                                _c(
                                  "a",
                                  {
                                    staticClass: "tabs__trigger",
                                    class: {
                                      active: _vm.active_view === "levels"
                                    },
                                    attrs: {
                                      href:
                                        "#series-registration-application-page-tab-body"
                                    },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.selectActiveView("levels")
                                      }
                                    }
                                  },
                                  [
                                    _vm._v(
                                      "\n                                    Levels\n                                "
                                    )
                                  ]
                                )
                              ])
                            ])
                          ])
                        ]
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "page__accent-content",
                      attrs: {
                        id: "series-registration-application-page-tab-body"
                      }
                    },
                    [
                      _c(
                        "div",
                        { staticClass: "grid-container" },
                        [
                          _vm.isActiveView("profile")
                            ? _c(_vm.profile_component, { tag: "component" })
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.isActiveView("profile")
                            ? _c(
                                "div",
                                {
                                  staticClass:
                                    "series-registration-application-page__continue"
                                },
                                [
                                  _c(
                                    "button",
                                    {
                                      staticClass:
                                        "button button--primary button--block button--large",
                                      on: {
                                        click: function($event) {
                                          $event.preventDefault()
                                          _vm.selectActiveView("levels", true)
                                        }
                                      }
                                    },
                                    [
                                      _vm._v(
                                        "\n                            Continue\n                        "
                                      )
                                    ]
                                  )
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.isActiveView("levels")
                            ? _c("application")
                            : _vm._e()
                        ],
                        1
                      )
                    ]
                  )
                ]
              )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=template&id=09c336c7&":
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=template&id=09c336c7& ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "series-application-application" },
    [
      _vm.show_refund_information
        ? _c(
            "div",
            {
              staticClass: "series-application-application__refund-information"
            },
            [
              _vm._v("\n        To request a refund contact\n        "),
              _c("br"),
              _vm._v(" "),
              _c(
                "a",
                {
                  staticClass: "standard-link",
                  attrs: { href: "mailto:" + _vm.series.refund_email_address }
                },
                [_vm._v(_vm._s(_vm.series.refund_email_address) + "\n        ")]
              )
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.levels_information
        ? _c(
            "div",
            { staticClass: "series-application-application__information" },
            [
              _c(
                "page-alert",
                {
                  staticClass:
                    "page-alert page-alert--notice page-alert--medium"
                },
                [
                  _c(
                    "div",
                    { attrs: { slot: "trigger_text" }, slot: "trigger_text" },
                    [
                      _vm._v(
                        "\n                Important Information\n            "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      attrs: { slot: "expand_content" },
                      slot: "expand_content"
                    },
                    [
                      _vm._v(
                        "\n                " +
                          _vm._s(_vm.levels_information) +
                          "\n            "
                      )
                    ]
                  )
                ]
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.disciplines, function(discipline) {
        return _c("discipline", {
          key: discipline.id,
          staticClass: "card",
          attrs: { discipline: discipline }
        })
      }),
      _vm._v(" "),
      _vm.memberSearchIsActive()
        ? _c("member-search-takeover", {
            on: {
              close: function($event) {
                _vm.memberSearchClose()
              }
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "series-application-application__footer" }, [
        _c("div", { staticClass: "grid-container" }, [
          _c(
            "div",
            {
              staticClass: "series-application-application__footer__information"
            },
            [
              _c(
                "div",
                {
                  staticClass:
                    "series-application-application__footer__information__price"
                },
                [
                  _c("span", { staticClass: "cost-display" }, [
                    _c("span", { staticClass: "cost-display__label" }, [
                      _vm._v("Total:")
                    ]),
                    _vm._v(" "),
                    _c("span", { staticClass: "cost-display__value" }, [
                      _vm._v("$" + _vm._s(_vm.total_cost))
                    ])
                  ])
                ]
              )
            ]
          ),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "series-application-application__footer__cta" },
            [
              _c(
                "div",
                {
                  staticClass:
                    "series-application-application__footer__cta__element"
                },
                [
                  _c(
                    "button",
                    {
                      staticClass:
                        "button button--large button--info button--block",
                      attrs: { disabled: _vm.disable_save },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.saveApplication(false)
                        }
                      }
                    },
                    [
                      _vm._v(
                        "\n                        " +
                          _vm._s(_vm.save_button_text) +
                          "\n                    "
                      )
                    ]
                  )
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass:
                    "series-application-application__footer__cta__element"
                },
                [
                  _c(
                    "button",
                    {
                      staticClass:
                        "button button--large button--action button--block",
                      attrs: { disabled: _vm.disable_pay },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          return _vm.handlePayClick($event)
                        }
                      }
                    },
                    [
                      _vm._v(
                        "\n                        Pay Now\n                    "
                      )
                    ]
                  )
                ]
              )
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c(
        "site-overlay",
        {
          staticClass: "site-overlay--faded",
          attrs: {
            transition_name: "fade",
            open_fn: _vm.overlayIsActive,
            show_header: false,
            lock_scroll: false
          }
        },
        [
          _c("div", { staticClass: "confirmation-overlay" }, [
            _c(
              "div",
              { staticClass: "confirmation-overlay__content" },
              [
                _vm.eligibility_confirmation_active
                  ? _c("series-registration-eligibility-confirmation", {
                      attrs: {
                        eligibility_documents:
                          _vm.series.application_configuration
                            .eligibility_documents
                      },
                      on: { continue: _vm.handleEligibilityConfirm }
                    })
                  : _vm.is_saving
                  ? _c("div", { staticClass: "confirmation-overlay__dialog" }, [
                      _c(
                        "div",
                        { staticClass: "confirmation-overlay__dialog__icon" },
                        [_c("animated-saving-icon")],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "confirmation-overlay__dialog__message confirmation-overlay__dialog__message--large"
                        },
                        [
                          _vm._v(
                            "\n                        Please wait while we save your information\n                    "
                          )
                        ]
                      )
                    ])
                  : _vm.save_error
                  ? _c("div", { staticClass: "confirmation-overlay__dialog" }, [
                      _c(
                        "div",
                        { staticClass: "confirmation-overlay__dialog__icon" },
                        [_c("i", { staticClass: "icon-danger" }, [_vm._v(" ")])]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "text--error confirmation-overlay__dialog__message"
                        },
                        [
                          _vm._v(
                            "\n                        " +
                              _vm._s(_vm.save_error) +
                              "\n                    "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c("div", [
                        _c(
                          "button",
                          {
                            staticClass: "button button--small",
                            on: { click: _vm.closeConfirmationOverlay }
                          },
                          [
                            _vm._v(
                              "\n                            OK\n                        "
                            )
                          ]
                        )
                      ])
                    ])
                  : _c("div", { staticClass: "confirmation-overlay__dialog" }, [
                      _c(
                        "div",
                        { staticClass: "confirmation-overlay__dialog__icon" },
                        [_c("animated-check-icon", { ref: "check" })],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "confirmation-overlay__dialog__message confirmation-overlay__dialog__message--large"
                        },
                        [
                          _vm._v(
                            "\n                        " +
                              _vm._s(_vm.confirmation_message) +
                              "\n                    "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c("div", [
                        _vm.cart_link
                          ? _c(
                              "a",
                              {
                                staticClass: "button button--small",
                                attrs: { href: _vm.cart_link }
                              },
                              [
                                _vm._v(
                                  "Continue to Cart\n                        "
                                )
                              ]
                            )
                          : _c(
                              "button",
                              {
                                staticClass: "button button--small",
                                on: { click: _vm.closeConfirmationOverlay }
                              },
                              [
                                _vm._v(
                                  "\n                            OK\n                        "
                                )
                              ]
                            )
                      ])
                    ])
              ],
              1
            )
          ])
        ]
      )
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=template&id=631e2e20&":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=template&id=631e2e20& ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "series-application-profile" },
    [
      _c("div", { staticClass: "user-profile-display" }, [
        _c("div", { staticClass: "user-profile-display__section" }, [
          _c(
            "h3",
            {
              staticClass:
                "user-profile-display__section-heading__text user-profile-display__section-heading__text--primary"
            },
            [
              _vm._v(
                "\n                " +
                  _vm._s(_vm.profile.full_name) +
                  "\n            "
              )
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "user-profile-display__data" }, [
            _c("ul", { staticClass: "label-list" }, [
              _c("li", [
                _c("span", { staticClass: "label-list__label" }, [
                  _vm._v("Member:")
                ]),
                _vm._v(" "),
                _c("span", { staticClass: "label-list__value" }, [
                  _vm._v("#" + _vm._s(_vm.profile.member_number))
                ])
              ]),
              _vm._v(" "),
              _c("li", [
                _c("span", { staticClass: "label-list__label" }, [
                  _vm._v("Date of Birth:")
                ]),
                _vm._v(" "),
                _vm.profile.birth_date
                  ? _c("span", { staticClass: "label-list__value" }, [
                      _vm._v(
                        "\n                            " +
                          _vm._s(_vm.profile.birth_date.formatted) +
                          "\n                        "
                      )
                    ])
                  : _c("span", { staticClass: "label-list__value" }, [
                      _c("em", [_vm._v("N/A")])
                    ])
              ]),
              _vm._v(" "),
              !_vm.edit_email_active
                ? _c("li", [
                    _c("span", { staticClass: "label-list__label" }, [
                      _vm._v("Email:")
                    ]),
                    _vm._v(" "),
                    _vm.profile.email
                      ? _c("span", { staticClass: "label-list__value" }, [
                          _vm._v(
                            "\n                            " +
                              _vm._s(_vm.profile.email) +
                              "\n                        "
                          )
                        ])
                      : _c("span", { staticClass: "label-list__value" }, [
                          _c("em", [_vm._v("N/A")])
                        ]),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass:
                          "icon-button icon-button--pseudo icon-button--edit icon-button--md series-application-profile__section-edit",
                        attrs: { title: "Edit email address" },
                        on: {
                          click: function($event) {
                            $event.preventDefault()
                            return _vm.openEmailEdit($event)
                          }
                        }
                      },
                      [
                        _c("span", { staticClass: "sr-only" }, [
                          _vm._v("Edit email address")
                        ])
                      ]
                    )
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.edit_email_active
                ? _c(
                    "li",
                    { staticClass: "series-application-profile__email-edit" },
                    [
                      _c("series-application-profile-email-edit", {
                        attrs: { value: _vm.email_edit_initial_value },
                        on: { close: _vm.closeEmailEdit }
                      })
                    ],
                    1
                  )
                : _vm._e()
            ])
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "user-profile-display__section" },
          [
            _c(
              "h3",
              { staticClass: "user-profile-display__section-heading__text" },
              [
                _c("span", [_vm._v("Section Eligibility")]),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass:
                      "series-application-profile__info-button icon-button icon-button--lg icon-button--info icon-button--pseudo",
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.active_info = "eligibility"
                      }
                    }
                  },
                  [
                    _c("span", { staticClass: "sr-only" }, [
                      _vm._v("View more information about section eligibility")
                    ])
                  ]
                )
              ]
            ),
            _vm._v(" "),
            _c("div", { staticClass: "user-profile-display__data" }, [
              _c("ul", { staticClass: "label-list" }, [
                _c("li", [
                  _c("span", { staticClass: "label-list__label" }, [
                    _vm._v("Club:")
                  ]),
                  _vm._v(" "),
                  _vm.profile.home_club
                    ? _c("span", { staticClass: "label-list__value" }, [
                        _vm._v(
                          "\n                            " +
                            _vm._s(_vm.profile.home_club.name) +
                            "\n                        "
                        )
                      ])
                    : _c("span", { staticClass: "label-list__value" }, [
                        _c("em", [_vm._v("N/A")])
                      ])
                ]),
                _vm._v(" "),
                _c("li", [
                  _c("span", { staticClass: "label-list__label" }, [
                    _vm._v("Region:")
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "label-list__value" }, [
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.profile.region_name) +
                        "\n                        "
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("li", [
                  _c("span", { staticClass: "label-list__label" }, [
                    _vm._v("Section:")
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "label-list__value" }, [
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.profile.section_name) +
                        "\n                        "
                    )
                  ])
                ])
              ])
            ]),
            _vm._v(" "),
            _vm.active_info === "eligibility"
              ? _c(
                  "popup",
                  {
                    staticClass: "popup popup--info popup--md",
                    attrs: { math_center: true },
                    on: {
                      "close-popup": function($event) {
                        _vm.active_info = false
                      }
                    }
                  },
                  [
                    _c(
                      "span",
                      { attrs: { slot: "heading-text" }, slot: "heading-text" },
                      [
                        _vm._v(
                          "\n                    Additional Information\n                "
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c("div", { attrs: { slot: "content" }, slot: "content" }, [
                      _c("p", [
                        _vm._v(
                          "\n                        Singles athletes are automatically entered in one of the three sections (Eastern,\n                        Midwestern, or Pacific Coast) for the series, based on the location of their home club,\n                        or if an individual member, their home address. Athletes will remain in this section for\n                        the duration of the series. Pairs and dance teams will receive a national ranking and\n                        are not tied to a section.\n                    "
                        )
                      ])
                    ])
                  ]
                )
              : _vm._e()
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass:
              "user-profile-display__section user-profile-display__section--skate-tests"
          },
          [
            _c(
              "h3",
              { staticClass: "user-profile-display__section-heading__text" },
              [
                _c("span", [_vm._v("Skate Tests")]),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass:
                      "series-application-profile__info-button icon-button icon-button--lg icon-button--info icon-button--pseudo",
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.active_info = "skate_tests"
                      }
                    }
                  },
                  [
                    _c("span", { staticClass: "sr-only" }, [
                      _vm._v("View more information about section eligibility")
                    ])
                  ]
                )
              ]
            ),
            _vm._v(" "),
            _c("skate-tests", {
              staticClass: "skate-tests--sm",
              attrs: {
                club_autosuggest_configuration: {
                  active: true,
                  restrict: false
                }
              }
            }),
            _vm._v(" "),
            _vm.active_info === "skate_tests"
              ? _c(
                  "popup",
                  {
                    staticClass: "popup popup--info popup--md",
                    attrs: { math_center: true },
                    on: {
                      "close-popup": function($event) {
                        _vm.active_info = false
                      }
                    }
                  },
                  [
                    _c(
                      "span",
                      { attrs: { slot: "heading-text" }, slot: "heading-text" },
                      [
                        _vm._v(
                          "\n                    Additional Information\n                "
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c("div", { attrs: { slot: "content" }, slot: "content" }, [
                      _c("p", [
                        _vm._v(
                          "A skater's test level determines which events they can enter at the competition."
                        )
                      ]),
                      _vm._v(" "),
                      _c("p", [
                        _vm._v(
                          "\n                        If you need assistance with this requirement, please email\n                        "
                        ),
                        _c(
                          "a",
                          {
                            staticClass:
                              "standard-link standard-link--no-underline",
                            attrs: {
                              href: "mailto:ProductSupport@usfigureskating.org"
                            }
                          },
                          [
                            _vm._v(
                              "ProductSupport@usfigureskating.org\n                        "
                            )
                          ]
                        )
                      ])
                    ])
                  ]
                )
              : _vm._e()
          ],
          1
        )
      ]),
      _vm._v(" "),
      _vm._t("default")
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=template&id=3c512003&":
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=template&id=3c512003& ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "series-application-profile" }, [
    _c("div", { staticClass: "user-profile-display" }, [
      _c("div", { staticClass: "user-profile-display__section" }, [
        _c(
          "h3",
          {
            staticClass:
              "user-profile-display__section-heading__text user-profile-display__section-heading__text--primary"
          },
          [
            _vm._v(
              "\n                " + _vm._s(_vm.profile.name) + "\n            "
            )
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "user-profile-display__data" }, [
          _c("ul", { staticClass: "label-list" }, [
            _c("li", [
              _c("span", { staticClass: "label-list__label" }, [
                _vm._v("Member:")
              ]),
              _vm._v(" "),
              _c("span", { staticClass: "label-list__value" }, [
                _vm._v("#" + _vm._s(_vm.profile.member_number))
              ])
            ]),
            _vm._v(" "),
            _c("li", [
              _c("span", { staticClass: "label-list__label" }, [
                _vm._v("Level:")
              ]),
              _vm._v(" "),
              _c("span", { staticClass: "label-list__value" }, [
                _vm._v(_vm._s(_vm.profile.level))
              ])
            ])
          ])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "user-profile-display__section" }, [
        _vm._m(0),
        _vm._v(" "),
        _c("div", { staticClass: "user-profile-display__data" }, [
          _c("ul", { staticClass: "label-list" }, [
            _vm.profile.home_club
              ? _c("li", [
                  _c("span", { staticClass: "label-list__label" }, [
                    _vm._v("Club:")
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "label-list__value" }, [
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.profile.home_club.name) +
                        "\n                        "
                    )
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.profile.region_name
              ? _c("li", [
                  _c("span", { staticClass: "label-list__label" }, [
                    _vm._v("Region:")
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "label-list__value" }, [
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.profile.region_name) +
                        "\n                        "
                    )
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.profile.section_name
              ? _c("li", [
                  _c("span", { staticClass: "label-list__label" }, [
                    _vm._v("Section:")
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "label-list__value" }, [
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.profile.section_name) +
                        "\n                        "
                    )
                  ])
                ])
              : _vm._e()
          ])
        ])
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "h3",
      { staticClass: "user-profile-display__section-heading__text" },
      [_c("span", [_vm._v("Section Eligibility")])]
    )
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=template&id=0a3ff769&":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=template&id=0a3ff769& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
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
      staticClass:
        "series-overview-application-discipline series-application-discipline"
    },
    [
      _c("div", { staticClass: "series-application-discipline__header" }, [
        _c("h3", { staticClass: "series-application-discipline__name" }, [
          _vm._v("\n            " + _vm._s(_vm.discipline.name) + "\n        ")
        ]),
        _vm._v(" "),
        _vm.document
          ? _c(
              "a",
              {
                staticClass:
                  "series-application-discipline__document-link icon-link icon-link--download",
                attrs: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                  href: _vm.document.link
                }
              },
              [
                _vm._v(
                  "\n            " + _vm._s(_vm.document.name) + "\n        "
                )
              ]
            )
          : _vm._e()
      ]),
      _vm._v(" "),
      _vm.partners.length
        ? _c("div", { staticClass: "series-application-discipline__section" }, [
            _c(
              "h4",
              { staticClass: "series-application-discipline__section-name" },
              [_vm._v("\n            Partner\n        ")]
            ),
            _vm._v(" "),
            _c(
              "ul",
              { staticClass: "series-application-discipline__element-list" },
              _vm._l(_vm.partners, function(partner) {
                return _c("li", { key: partner.id }, [
                  _c(
                    "div",
                    { staticClass: "series-application-discipline__element" },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__label"
                        },
                        [
                          _vm._v(
                            "\n                        " +
                              _vm._s(partner.first_name) +
                              " " +
                              _vm._s(partner.last_name) +
                              "\n                        "
                          ),
                          partner.ineligible
                            ? _c("span", { staticClass: "text--error" }, [
                                _vm._v("(Ineligible)")
                              ])
                            : _vm._e()
                        ]
                      )
                    ]
                  )
                ])
              })
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.levels.length
        ? _c("div", { staticClass: "series-application-discipline__section" }, [
            _c(
              "h4",
              { staticClass: "series-application-discipline__section-name" },
              [_vm._v("\n            Levels\n        ")]
            ),
            _vm._v(" "),
            _c(
              "ul",
              { staticClass: "series-application-discipline__element-list" },
              _vm._l(_vm.levels, function(level) {
                return _c("li", { key: level.id }, [
                  _c(
                    "div",
                    { staticClass: "series-application-discipline__element" },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__label"
                        },
                        [
                          _vm._v(
                            "\n                        " +
                              _vm._s(level.name) +
                              "\n                    "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__payment-status",
                          class: _vm._f("level_class")(level)
                        },
                        [
                          _c(
                            "span",
                            {
                              staticClass:
                                "series-application-discipline__element__payment-status__text"
                            },
                            [
                              _vm._v(
                                "\n                            " +
                                  _vm._s(level.is_paid ? "Paid" : "Unpaid") +
                                  "\n                        "
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "i",
                            {
                              staticClass:
                                "series-application-discipline__element__payment-status__icon",
                              class: _vm._f("level_icon_class")(level)
                            },
                            [_vm._v(" \n                        ")]
                          )
                        ]
                      )
                    ]
                  )
                ])
              })
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.coaches.length
        ? _c("div", { staticClass: "series-application-discipline__section" }, [
            _c(
              "h4",
              { staticClass: "series-application-discipline__section-name" },
              [_vm._v("\n            Coaches\n        ")]
            ),
            _vm._v(" "),
            _vm.coaches.length
              ? _c(
                  "ul",
                  {
                    staticClass: "series-application-discipline__element-list"
                  },
                  _vm._l(_vm.coaches, function(coach) {
                    return _c("li", { key: coach.id }, [
                      _c(
                        "div",
                        {
                          staticClass: "series-application-discipline__element"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "series-application-discipline__element__label"
                            },
                            [
                              _vm._v(
                                "\n                        " +
                                  _vm._s(coach.first_name) +
                                  " " +
                                  _vm._s(coach.last_name) +
                                  "\n                        "
                              ),
                              coach.ineligible
                                ? _c("span", { staticClass: "text--error" }, [
                                    _vm._v("(Ineligible)")
                                  ])
                                : _vm._e()
                            ]
                          )
                        ]
                      )
                    ])
                  })
                )
              : _vm._e()
          ])
        : _vm._e()
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=template&id=194786d4&":
/*!*************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=template&id=194786d4& ***!
  \*************************************************************************************************************************************************************************************************************************************************************/
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
      staticClass:
        "series-overview-application-discipline series-application-discipline"
    },
    [
      _c("div", { staticClass: "series-application-discipline__header" }, [
        _c("h3", { staticClass: "series-application-discipline__name" }, [
          _vm._v(
            "\n            " +
              _vm._s(_vm.team.name) +
              " - " +
              _vm._s(_vm.team.level) +
              "\n        "
          )
        ]),
        _vm._v(" "),
        _vm.document
          ? _c(
              "a",
              {
                staticClass:
                  "series-application-discipline__document-link icon-link icon-link--download",
                attrs: {
                  href: _vm.document.url,
                  rel: "noopener noreferrer",
                  target: "_blank"
                }
              },
              [
                _vm._v(
                  "\n            " + _vm._s(_vm.document.name) + "\n        "
                )
              ]
            )
          : _vm._e()
      ]),
      _vm._v(" "),
      _vm.levels.length
        ? _c("div", { staticClass: "series-application-discipline__section" }, [
            _c(
              "ul",
              { staticClass: "series-application-discipline__element-list" },
              _vm._l(_vm.levels, function(level) {
                return _c("li", { key: level.id }, [
                  _c(
                    "div",
                    { staticClass: "series-application-discipline__element" },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__label"
                        },
                        [
                          _vm._v(
                            "\n                        " +
                              _vm._s(level.name) +
                              "\n                    "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-application-discipline__element__payment-status",
                          class: _vm._f("level_class")(level)
                        },
                        [
                          _c(
                            "span",
                            {
                              staticClass:
                                "series-application-discipline__element__payment-status__text"
                            },
                            [
                              _vm._v(
                                "\n                            " +
                                  _vm._s(level.is_paid ? "Paid" : "Unpaid") +
                                  "\n                        "
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "i",
                            {
                              staticClass:
                                "series-application-discipline__element__payment-status__icon",
                              class: _vm._f("level_icon_class")(level)
                            },
                            [_vm._v(" \n                        ")]
                          )
                        ]
                      )
                    ]
                  )
                ])
              })
            )
          ])
        : _vm._e()
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=template&id=fad9da4e&":
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=template&id=fad9da4e& ***!
  \*************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "series-overview-cta" }, [
    _vm.show_deadline
      ? _c("p", { staticClass: "text--muted series-overview-cta__deadline" }, [
          _vm._v(
            "\n        Application deadline: " +
              _vm._s(_vm.series.application_deadline_formatted) +
              "\n    "
          )
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.show_application_button
      ? _c(
          "a",
          {
            staticClass: "button button--block button--large",
            attrs: { href: _vm.series.links.application }
          },
          [
            _vm._v(
              "\n        " + _vm._s(_vm.application_button_text) + "\n    "
            )
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.show_pay
      ? _c("div", { staticClass: "series-overview-cta__cost" }, [
          _c("span", { staticClass: "cost-display" }, [
            _c("span", { staticClass: "cost-display__label" }, [
              _vm._v("Total:")
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "cost-display__value" }, [
              _vm._v("$" + _vm._s(_vm.total_cost))
            ])
          ])
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.show_pay
      ? _c(
          "a",
          {
            staticClass: "button button--block button--large button--action",
            on: {
              click: function($event) {
                $event.preventDefault()
                _vm.$emit("pay-attempt")
              }
            }
          },
          [_vm._v("Pay Now\n    ")]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.show_standings
      ? _c(
          "a",
          {
            staticClass: "button button--block button--large",
            attrs: { href: _vm.series.links.standings }
          },
          [_vm._v("Standings\n    ")]
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=template&id=bb781588&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=template&id=bb781588& ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "series-overview-cta" }, [
    _vm.show_deadline
      ? _c("p", { staticClass: "text--muted series-overview-cta__deadline" }, [
          _vm._v(
            "\n        Application deadline: " +
              _vm._s(_vm.series.application_deadline_formatted) +
              "\n    "
          )
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.show_application_button
      ? _c(
          "a",
          {
            staticClass: "button button--block button--large",
            attrs: { href: _vm.series.links.application }
          },
          [
            _vm._v(
              "\n        " + _vm._s(_vm.application_button_text) + "\n    "
            )
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.show_standings
      ? _c(
          "a",
          {
            staticClass: "button button--block button--large",
            attrs: { href: _vm.series.links.standings }
          },
          [_vm._v("Standings\n    ")]
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=template&id=aedc6b48&":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=template&id=aedc6b48& ***!
  \*********************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "series-registration-overview-page" },
    [
      _c(
        "page",
        {
          class: {
            "page--accent": _vm.component_loaded && _vm.application_exists
          },
          style: _vm.page_style,
          attrs: { header: _vm.page_header }
        },
        [
          _vm.component_loaded
            ? _c("series-page-header", {
                attrs: { slot: "pre-header", series: _vm.series },
                slot: "pre-header"
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.component_loaded && _vm.status_message
            ? _c(
                "div",
                {
                  staticClass:
                    "series-registration-overview-page__status-message",
                  attrs: { slot: "header-content" },
                  slot: "header-content"
                },
                [
                  _c(
                    "span",
                    {
                      class: _vm._f("status_class")(
                        _vm.series.status.message.type_key
                      )
                    },
                    [_vm._v("Series Status:")]
                  ),
                  _vm._v(" "),
                  _c("span", [_vm._v(_vm._s(_vm.series.status.message.text))])
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          !_vm.component_loaded
            ? _c("component-loader", {
                attrs: {
                  slot: "loader",
                  container: true,
                  source: this,
                  error_message: "Error loading series information."
                },
                slot: "loader"
              })
            : _c(
                "div",
                { staticClass: "series-registration-overview-page__content" },
                [
                  _c("div", { staticClass: "page--accent__standard-content" }, [
                    _c("div", { staticClass: "grid-container" }, [
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-registration-overview-page__statement"
                        },
                        [
                          _vm.application_exists
                            ? _c(
                                "page-alert",
                                {
                                  staticClass:
                                    "page-alert page-alert--notice page-alert--medium"
                                },
                                [
                                  _c(
                                    "div",
                                    {
                                      attrs: { slot: "trigger_text" },
                                      slot: "trigger_text"
                                    },
                                    [
                                      _vm._v(
                                        "\n                                Statement\n                            "
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      attrs: { slot: "expand_content" },
                                      slot: "expand_content"
                                    },
                                    [
                                      _vm._v(
                                        "\n                                " +
                                          _vm._s(_vm.series.statement) +
                                          "\n                            "
                                      )
                                    ]
                                  )
                                ]
                              )
                            : _c("p", [
                                _vm._v(
                                  "\n                            " +
                                    _vm._s(_vm.series.statement) +
                                    "\n                        "
                                )
                              ])
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "series-registration-overview-page__contact"
                        },
                        [
                          _c("p", [
                            _vm._v(
                              "\n                            If you have questions, email\n                            "
                            ),
                            _c(
                              "a",
                              {
                                staticClass:
                                  "standard-link standard-link--no-visited",
                                attrs: {
                                  href:
                                    "mailto:" + _vm.series.contact_email_address
                                }
                              },
                              [
                                _vm._v(
                                  _vm._s(_vm.series.contact_email_address) +
                                    "\n                            "
                                )
                              ]
                            )
                          ]),
                          _vm._v(" "),
                          _vm.show_refund_contact
                            ? _c("p", [
                                _vm._v(
                                  "\n                            Need a refund?\n                            "
                                ),
                                _c(
                                  "a",
                                  {
                                    staticClass:
                                      "standard-link standard-link--no-visited",
                                    attrs: {
                                      href:
                                        "mailto:" +
                                        _vm.series.refund_email_address
                                    }
                                  },
                                  [
                                    _vm._v(
                                      _vm._s(_vm.series.refund_email_address) +
                                        "\n                            "
                                    )
                                  ]
                                )
                              ])
                            : _vm._e()
                        ]
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _vm.application_exists
                    ? _c(
                        "div",
                        {
                          staticClass:
                            "series-registration-overview-page__application page__accent-content"
                        },
                        [
                          _vm.user_application
                            ? _c(
                                "div",
                                { staticClass: "grid-container" },
                                _vm._l(
                                  _vm.user_application.disciplines,
                                  function(discipline) {
                                    return _c(
                                      "series-overview-application-discipline",
                                      {
                                        key: discipline.id,
                                        staticClass: "card",
                                        attrs: { discipline: discipline }
                                      }
                                    )
                                  }
                                )
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.applied_teams
                            ? _c(
                                "div",
                                { staticClass: "grid-container" },
                                _vm._l(_vm.applied_teams.teams, function(team) {
                                  return _c(
                                    "series-overview-application-team",
                                    {
                                      key: team.id,
                                      staticClass: "card",
                                      attrs: { team: team }
                                    }
                                  )
                                })
                              )
                            : _vm._e()
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.series.reports
                    ? _c(
                        "div",
                        {
                          staticClass:
                            "series-registration-overview-page__reports"
                        },
                        [
                          _c("div", { staticClass: "grid-container" }, [
                            _c(
                              "ul",
                              {
                                staticClass:
                                  "series-registration-overview-page__reports__list"
                              },
                              _vm._l(_vm.series.reports, function(
                                report,
                                index
                              ) {
                                return _c("li", { key: index }, [
                                  _c(
                                    "a",
                                    {
                                      staticClass:
                                        "icon-link icon-link--download",
                                      attrs: {
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        href: report.link
                                      }
                                    },
                                    [
                                      _vm._v(
                                        "\n                                " +
                                          _vm._s(report.name) +
                                          "\n                            "
                                      )
                                    ]
                                  )
                                ])
                              })
                            )
                          ])
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.show_footer
                    ? _c(
                        "div",
                        {
                          ref: "footer",
                          staticClass:
                            "series-registration-overview-page__footer"
                        },
                        [
                          _c(
                            "div",
                            { staticClass: "grid-container" },
                            [
                              !_vm.series.is_team_series
                                ? _c("series-overview-cta", {
                                    attrs: {
                                      series: _vm.series,
                                      application: _vm.user_application
                                    },
                                    on: {
                                      "pay-attempt": _vm.handlePayAttempt,
                                      mounted: _vm.updatePageFooterOffset
                                    }
                                  })
                                : _c("series-overview-team-cta", {
                                    attrs: {
                                      application_exists:
                                        _vm.team_application_exists,
                                      series: _vm.series
                                    },
                                    on: {
                                      mounted: _vm.updatePageFooterOffset,
                                      "pay-attempt": _vm.handlePayAttempt
                                    }
                                  })
                            ],
                            1
                          )
                        ]
                      )
                    : _vm._e()
                ]
              ),
          _vm._v(" "),
          _c(
            "site-overlay",
            {
              staticClass: "site-overlay--faded",
              attrs: {
                transition_name: "fade",
                open_fn: _vm.overlayIsActive,
                show_header: false,
                lock_scroll: false
              }
            },
            [
              _c(
                "div",
                { staticClass: "confirm-action-overlay" },
                [
                  _vm.eligibility_confirmation_active
                    ? _c("series-registration-eligibility-confirmation", {
                        attrs: {
                          eligibility_documents:
                            _vm.series.application_configuration
                              .eligibility_documents
                        },
                        on: { continue: _vm.handleEligibilityConfirm }
                      })
                    : _vm.pay_confirmation_active
                    ? _c(
                        "div",
                        { staticClass: "confirm-action-overlay__content" },
                        [
                          _c(
                            "div",
                            { staticClass: "confirm-action-overlay__dialog" },
                            [
                              _c(
                                "div",
                                {
                                  staticClass: "confirm-action-overlay__message"
                                },
                                [
                                  _vm._v(
                                    "\n                            Do you want to make additional\n                            "
                                  ),
                                  _c("br"),
                                  _vm._v(
                                    "\n                            updates before you pay?\n                        "
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "confirm-action-overlay__cta" },
                                [
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "confirm-action-overlay__cta__button"
                                    },
                                    [
                                      _c(
                                        "a",
                                        {
                                          staticClass:
                                            "button button--small button--info button--block",
                                          attrs: {
                                            href: _vm.series.links.application
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                    Update\n                                "
                                          )
                                        ]
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "confirm-action-overlay__cta__button"
                                    },
                                    [
                                      _c(
                                        "a",
                                        {
                                          staticClass:
                                            "button button--action button--small button--block",
                                          attrs: {
                                            href: _vm.series.links.checkout
                                          },
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.eligibility_confirmation_active = true
                                            }
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                    Pay\n                                "
                                          )
                                        ]
                                      )
                                    ]
                                  )
                                ]
                              )
                            ]
                          )
                        ]
                      )
                    : _vm._e()
                ],
                1
              )
            ]
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=template&id=5a1c2ea7&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=template&id=5a1c2ea7& ***!
  \******************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "standings-global-filter filter-takeover" }, [
    _c("div", { staticClass: "grid-container" }, [
      _c(
        "h2",
        { staticClass: "site-takeover__title site-takeover__title--large" },
        [
          _vm._v(
            "\n            Filter by Section, Levels and Disciplines\n        "
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "filter-takeover__body" },
        [
          _c("parented-checkbox-group", {
            attrs: {
              options: _vm.available_global_filters.disciplines,
              all_suffix: "Disciplines"
            },
            model: {
              value: _vm.discipline_filter,
              callback: function($$v) {
                _vm.discipline_filter = $$v
              },
              expression: "discipline_filter"
            }
          }),
          _vm._v(" "),
          _c("parented-checkbox-group", {
            attrs: {
              options: _vm.available_global_filters.levels,
              all_suffix: "Levels"
            },
            model: {
              value: _vm.level_filter,
              callback: function($$v) {
                _vm.level_filter = $$v
              },
              expression: "level_filter"
            }
          }),
          _vm._v(" "),
          _c("parented-checkbox-group", {
            attrs: {
              options: _vm.available_global_filters.sections,
              all_suffix: "Sections"
            },
            model: {
              value: _vm.section_filter,
              callback: function($$v) {
                _vm.section_filter = $$v
              },
              expression: "section_filter"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: " filter-takeover__apply" }, [
        _vm.apply_attempt && !_vm.valid
          ? _c("p", { staticClass: "input-error" }, [
              _vm._v(
                "\n                " +
                  _vm._s(_vm.validation_error) +
                  "\n            "
              )
            ])
          : _vm._e(),
        _vm._v(" "),
        _c(
          "button",
          {
            staticClass: "button button--large button--block",
            on: {
              click: function($event) {
                $event.preventDefault()
                return _vm.apply($event)
              }
            }
          },
          [_vm._v("\n                Apply\n            ")]
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=template&id=946205b8&":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=template&id=946205b8& ***!
  \********************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "standings-granular-filter two-tier-filter" },
    [
      _c("div", { staticClass: "two-tier-filter__field" }, [
        _c("div", { staticClass: "form-group" }, [
          _c(
            "label",
            {
              staticClass: "field-label sr-only",
              attrs: { for: "filter_field" }
            },
            [_vm._v("\n                Search By\n            ")]
          ),
          _vm._v(" "),
          _c(
            "select",
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.filter_field,
                  expression: "filter_field"
                }
              ],
              staticClass: "form-field form-field--reduced-right",
              attrs: { id: "filter_field" },
              on: {
                change: function($event) {
                  var $$selectedVal = Array.prototype.filter
                    .call($event.target.options, function(o) {
                      return o.selected
                    })
                    .map(function(o) {
                      var val = "_value" in o ? o._value : o.value
                      return val
                    })
                  _vm.filter_field = $event.target.multiple
                    ? $$selectedVal
                    : $$selectedVal[0]
                }
              }
            },
            [
              _c(
                "option",
                {
                  attrs: { selected: "", disabled: "" },
                  domProps: { value: null }
                },
                [_vm._v("\n                    Search by:\n                ")]
              ),
              _vm._v(" "),
              _vm._l(_vm.field_options, function(option) {
                return _c(
                  "option",
                  { key: option.value, domProps: { value: option } },
                  [
                    _vm._v(
                      "\n                    " +
                        _vm._s(option.label) +
                        "\n                "
                    )
                  ]
                )
              })
            ],
            2
          )
        ])
      ]),
      _vm._v(" "),
      _vm.filter_field
        ? _c("div", { staticClass: "two-tier-filter__term" }, [
            _vm.filter_field.type === "number_range"
              ? _c(
                  "div",
                  { staticClass: "standings-granular-filter__national-rank" },
                  [
                    _c(
                      "div",
                      {
                        staticClass:
                          "form-row form-row--range form-row--range--pre-labeled"
                      },
                      [
                        _c(
                          "div",
                          { staticClass: "form-row--range__pre-label" },
                          [
                            _vm._v(
                              "\n                    From\n                "
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "form-column" }, [
                          _c("div", { staticClass: "form-group" }, [
                            _c(
                              "label",
                              {
                                staticClass: "sr-only",
                                attrs: { for: "range_min" }
                              },
                              [_vm._v("Min\n                        ")]
                            ),
                            _vm._v(" "),
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.filter_term[0],
                                  expression: "filter_term[0]"
                                },
                                {
                                  name: "number-input",
                                  rawName: "v-number-input"
                                }
                              ],
                              staticClass: "form-field",
                              attrs: { id: "range_min", type: "text" },
                              domProps: { value: _vm.filter_term[0] },
                              on: {
                                input: function($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.$set(
                                    _vm.filter_term,
                                    0,
                                    $event.target.value
                                  )
                                }
                              }
                            })
                          ])
                        ]),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "form-row--range__separator" },
                          [_vm._v("\n                    to\n                ")]
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "form-column" }, [
                          _c("div", { staticClass: "form-group" }, [
                            _c(
                              "label",
                              {
                                staticClass: "sr-only",
                                attrs: { for: "range_max" }
                              },
                              [_vm._v("Max\n                        ")]
                            ),
                            _vm._v(" "),
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.filter_term[1],
                                  expression: "filter_term[1]"
                                },
                                {
                                  name: "number-input",
                                  rawName: "v-number-input"
                                }
                              ],
                              staticClass: "form-field",
                              attrs: { id: "range_max", type: "text" },
                              domProps: { value: _vm.filter_term[1] },
                              on: {
                                input: function($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.$set(
                                    _vm.filter_term,
                                    1,
                                    $event.target.value
                                  )
                                }
                              }
                            })
                          ])
                        ])
                      ]
                    )
                  ]
                )
              : _c("div", { staticClass: "form-group" }, [
                  _c(
                    "label",
                    { staticClass: "sr-only", attrs: { for: "filter_term" } },
                    [
                      _vm._v(
                        "\n                " +
                          _vm._s(_vm.filter_field.label) +
                          "\n            "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.filter_term[0],
                        expression: "filter_term[0]"
                      }
                    ],
                    staticClass:
                      "form-field form-field--search form-field--reduced-right",
                    attrs: {
                      id: "filter_term",
                      placeholder: _vm.input_placeholder,
                      type: "text",
                      name: "filter_term"
                    },
                    domProps: { value: _vm.filter_term[0] },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.$set(_vm.filter_term, 0, $event.target.value)
                      }
                    }
                  })
                ])
          ])
        : _vm._e()
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=template&id=c3c74d5c&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=template&id=c3c74d5c& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "standings-table" }, [
    _vm.standings.length
      ? _c("div", { staticClass: "standings-table__header" }, [
          _c("div", { staticClass: "labeled-toggle" }, [
            _c("span", { staticClass: "labeled-toggle__label" }, [
              _vm._v(
                "\n                Show " +
                  _vm._s(_vm.show_expanded_content ? "less" : "more") +
                  " standings detail\n            "
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "labeled-toggle__toggle toggle toggle--sm" },
              [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.show_expanded_content,
                      expression: "show_expanded_content"
                    }
                  ],
                  staticClass: "toggle__input",
                  attrs: {
                    id: "view-mode-toggle-" + _vm.uid,
                    type: "checkbox"
                  },
                  domProps: {
                    checked: Array.isArray(_vm.show_expanded_content)
                      ? _vm._i(_vm.show_expanded_content, null) > -1
                      : _vm.show_expanded_content
                  },
                  on: {
                    change: function($event) {
                      var $$a = _vm.show_expanded_content,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            (_vm.show_expanded_content = $$a.concat([$$v]))
                        } else {
                          $$i > -1 &&
                            (_vm.show_expanded_content = $$a
                              .slice(0, $$i)
                              .concat($$a.slice($$i + 1)))
                        }
                      } else {
                        _vm.show_expanded_content = $$c
                      }
                    }
                  }
                }),
                _vm._v(" "),
                _c("label", {
                  staticClass: "toggle__user-input",
                  attrs: { for: "view-mode-toggle-" + _vm.uid }
                })
              ]
            )
          ])
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.standings.length
      ? _c(
          "ul",
          { staticClass: "standings-table__list" },
          _vm._l(_vm.standings, function(standing) {
            return _c(
              "li",
              { key: standing.id, staticClass: "standings-table__list__item" },
              [
                _c("standings-table-item", {
                  attrs: {
                    standing: standing,
                    show_expanded_content: _vm.show_expanded_content
                  }
                })
              ],
              1
            )
          })
        )
      : _c("div", { staticClass: "standings-table__notice" }, [
          _c("p", { staticClass: "text--error" }, [
            _vm._v(
              "\n            No standings for " +
                _vm._s(_vm.event_name) +
                " match your current search/filters.\n        "
            )
          ])
        ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=template&id=ea0eebf6&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=template&id=ea0eebf6& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
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
      staticClass: "standings-table-item",
      class: { "standings-table-item--expanded": _vm.show_expanded_content }
    },
    [
      _c("div", { staticClass: "standings-table-item__badge" }, [
        _c(
          "div",
          { staticClass: "standings-item-badge", class: _vm.badge_class },
          [
            _c(
              "span",
              {
                staticClass: "standings-item-badge__primary",
                class: {
                  "standings-item-badge__primary--reduced": !_vm.standing
                    .national_rank
                }
              },
              [
                _vm._v(
                  "\n                " +
                    _vm._s(
                      _vm._f("nullable_rank_score")(_vm.standing.national_rank)
                    ) +
                    "\n            "
                )
              ]
            ),
            _vm._v(" "),
            _c(
              "span",
              {
                staticClass: "standings-item-badge__secondary",
                class: _vm.badge_secondary_class
              },
              [
                _c("span", [
                  _vm._v(_vm._s(_vm.standing.section_key[0].toUpperCase()))
                ]),
                _vm.standing.sectional_rank
                  ? _c("span", [
                      _vm._v("-" + _vm._s(_vm.standing.sectional_rank))
                    ])
                  : _vm._e()
              ]
            )
          ]
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "standings-table-item__description" }, [
        _c("p", { staticClass: "standings-table-item__description__datum" }, [
          _vm._v(
            "\n            " +
              _vm._s(_vm.standing.participant_name) +
              "\n        "
          )
        ]),
        _vm._v(" "),
        _vm.show_expanded_content
          ? _c(
              "p",
              {
                staticClass:
                  "standings-table-item__description__datum text--muted"
              },
              [
                _vm._v(
                  "\n            " +
                    _vm._s(_vm.standing.home_club) +
                    "\n        "
                )
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.show_expanded_content && _vm.standing.competition_earned
          ? _c(
              "p",
              {
                staticClass:
                  "standings-table-item__description__datum standings-table-item__description__datum--small text--muted"
              },
              [
                _vm._v(
                  "\n            " +
                    _vm._s(_vm.standing.competition_earned) +
                    "\n        "
                )
              ]
            )
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "standings-table-item__score" }, [
        _vm._v(
          "\n        " +
            _vm._s(_vm._f("nullable_rank_score")(_vm.standing.highest_score)) +
            "\n    "
        )
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=template&id=43797166&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=template&id=43797166& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
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
      staticClass: "series-standings-page",
      class: { "page--accent": _vm.component_loaded }
    },
    [
      _c(
        "page",
        { attrs: { header: _vm.page_header } },
        [
          _vm.component_loaded
            ? _c("series-page-header", {
                attrs: { slot: "pre-header", series: _vm.series },
                slot: "pre-header"
              })
            : _vm._e(),
          _vm._v(" "),
          _c(
            "div",
            { attrs: { slot: "header-content" }, slot: "header-content" },
            [
              _c(
                "div",
                { staticClass: "series-standings-page__update-notice" },
                [
                  _vm.standings_last_updated
                    ? _c(
                        "p",
                        {
                          staticClass:
                            "series-standings-page__update-notice__date"
                        },
                        [
                          _vm._v(
                            "\n                    Updated: " +
                              _vm._s(_vm.standings_last_updated) +
                              "\n                "
                          )
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "p",
                    {
                      staticClass:
                        "series-standings-page__update-notice__description"
                    },
                    [
                      _vm._v(
                        "\n                    Series standings are updated daily, see above for last update. Note: results could take up to 24\n                    hours to process upon conclusion of competition.\n                "
                      )
                    ]
                  )
                ]
              ),
              _vm._v(" "),
              _vm.resource_documents.length
                ? _c(
                    "div",
                    { staticClass: "series-standings-page__resources" },
                    [
                      _c("p", [_vm._v("Resource PDFs for eligibility:")]),
                      _vm._v(" "),
                      _c(
                        "ul",
                        { staticClass: "series-standings-page__resource-list" },
                        _vm._l(_vm.resource_documents, function(
                          document,
                          index
                        ) {
                          return _c(
                            "li",
                            {
                              key: index,
                              staticClass:
                                "series-standings-page__resource-list__item"
                            },
                            [
                              _c(
                                "a",
                                {
                                  staticClass: "icon-link icon-link--download",
                                  attrs: {
                                    href: document.link,
                                    target: "_blank",
                                    rel: "noreferrer noopener"
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                            " +
                                      _vm._s(document.name) +
                                      "\n                        "
                                  )
                                ]
                              )
                            ]
                          )
                        })
                      )
                    ]
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "series-standings-page__granular-filter" },
                [_c("standings-granular-filter")],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "series-standings-page__global-filter-trigger" },
                [
                  _c(
                    "a",
                    {
                      staticClass: "standard-link",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.global_filters_active = true
                        }
                      }
                    },
                    [
                      _vm._v(
                        "Filter by Disciplines, Levels and Section\n                "
                      )
                    ]
                  )
                ]
              )
            ]
          ),
          _vm._v(" "),
          !_vm.component_loaded
            ? _c("component-loader", {
                attrs: {
                  slot: "loader",
                  container: true,
                  source: this,
                  error_message: "Error loading standings."
                },
                slot: "loader"
              })
            : _c(
                "div",
                {
                  staticClass:
                    "series-standings-page__content page__accent-content pagination-footer-offset"
                },
                [
                  _c("div", { staticClass: "grid-container" }, [
                    _vm.events.length
                      ? _c(
                          "div",
                          _vm._l(_vm.visible_items, function(event) {
                            return _c(
                              "accordion",
                              {
                                key: event.uid,
                                staticClass:
                                  "accordion--info accordion--info--large",
                                attrs: {
                                  external_expand_check: _vm.accordionOpen(
                                    event.uid
                                  )
                                },
                                on: {
                                  accordion_toggle: function($event) {
                                    _vm.handleAccordionToggle(event.uid)
                                  }
                                }
                              },
                              [
                                _c(
                                  "span",
                                  {
                                    attrs: { slot: "trigger_text" },
                                    slot: "trigger_text"
                                  },
                                  [_vm._v(_vm._s(event.name))]
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  {
                                    attrs: { slot: "expand_content" },
                                    slot: "expand_content"
                                  },
                                  [
                                    _c("standings-table", {
                                      attrs: {
                                        standings: event.standings,
                                        event_name: event.name
                                      }
                                    })
                                  ],
                                  1
                                )
                              ]
                            )
                          })
                        )
                      : _c(
                          "p",
                          {
                            staticClass:
                              "series-standings-page__no-results text--error"
                          },
                          [
                            _vm._v(
                              "\n                    No standings match your current search/filters.\n                "
                            )
                          ]
                        )
                  ])
                ]
              ),
          _vm._v(" "),
          _vm.show_pagination
            ? _c(
                "div",
                {
                  staticClass: "pagination-footer series-standings-page__footer"
                },
                [
                  _c(
                    "div",
                    { staticClass: "grid-container" },
                    [
                      _c("pagination", {
                        ref: "pagination",
                        attrs: { paginated_items: _vm.paginated_items },
                        on: { "page-changed": _vm.handleActivePageChange }
                      })
                    ],
                    1
                  )
                ]
              )
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      _vm.global_filters_active
        ? _c(
            "site-takeover",
            {
              attrs: { return_to_scroll_location: true },
              on: {
                close: function($event) {
                  _vm.global_filters_active = false
                }
              }
            },
            [
              _c("standings-global-filter", {
                on: {
                  close: function($event) {
                    _vm.global_filters_active = false
                  }
                }
              })
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=template&id=39b73a9f&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=template&id=39b73a9f& ***!
  \*********************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "series-page-header" }, [
    _c("div", { staticClass: "grid-container" }, [
      _c("div", { staticClass: "series-summary" }, [
        _c("div", { staticClass: "series-summary__icon" }, [
          _c("img", {
            attrs: {
              src: _vm.series.icon,
              alt: "Series icon for " + _vm.series.name
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "series-summary__details" }, [
          _c("p", { staticClass: "series-summary__primary" }, [
            _vm._v(
              "\n                    " +
                _vm._s(_vm.series.name) +
                "\n                "
            )
          ]),
          _vm._v(" "),
          _c("p", { staticClass: "series-summary__secondary" }, [
            _vm._v(
              "\n                    Application Deadline: " +
                _vm._s(_vm.series.application_deadline_formatted) +
                "\n                "
            )
          ])
        ])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=template&id=1d495854&":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=template&id=1d495854& ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "series-registration-eligibility-confirmation" },
    [
      _c("div", { staticClass: "confirmation-overlay__dialog" }, [
        _c(
          "h3",
          {
            staticClass: "series-registration-eligibility-confirmation__title"
          },
          [_vm._v("\n            Eligibility Confirmation\n        ")]
        ),
        _vm._v(" "),
        _c(
          "label",
          {
            staticClass: "usfsa-checkbox",
            attrs: { for: "eligibility_confirm" }
          },
          [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.confirmed,
                  expression: "confirmed"
                }
              ],
              attrs: { id: "eligibility_confirm", type: "checkbox" },
              domProps: {
                checked: Array.isArray(_vm.confirmed)
                  ? _vm._i(_vm.confirmed, null) > -1
                  : _vm.confirmed
              },
              on: {
                change: function($event) {
                  var $$a = _vm.confirmed,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false
                  if (Array.isArray($$a)) {
                    var $$v = null,
                      $$i = _vm._i($$a, $$v)
                    if ($$el.checked) {
                      $$i < 0 && (_vm.confirmed = $$a.concat([$$v]))
                    } else {
                      $$i > -1 &&
                        (_vm.confirmed = $$a
                          .slice(0, $$i)
                          .concat($$a.slice($$i + 1)))
                    }
                  } else {
                    _vm.confirmed = $$c
                  }
                }
              }
            }),
            _vm._v(" "),
            _c("span", { staticClass: "usfsa-checkbox__text" }, [
              _vm._v("I have read and reviewed eligibility requirements.")
            ])
          ]
        ),
        _vm._v(" "),
        _c(
          "ul",
          {
            staticClass:
              "series-registration-eligibility-confirmation__document-list"
          },
          _vm._l(_vm.eligibility_documents, function(document, index) {
            return _c("li", { key: index }, [
              _c(
                "a",
                {
                  staticClass: "icon-link icon-link--download",
                  attrs: {
                    href: document.link,
                    target: "_blank",
                    rel: "noopener noreferrer"
                  }
                },
                [_vm._v(_vm._s(document.name) + "\n                ")]
              )
            ])
          })
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "series-registration-eligibility-confirmation__cta" },
          [
            _c(
              "button",
              {
                staticClass: "button button--medium button--block",
                attrs: { disabled: _vm.disable_button },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.$emit("continue")
                  }
                }
              },
              [_vm._v("\n                Continue\n            ")]
            )
          ]
        )
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=template&id=645ae98e&":
/*!***************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=template&id=645ae98e& ***!
  \***************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "series-registration-index-page" },
    [
      _c(
        "page",
        { attrs: { header: _vm.page_header } },
        [
          !_vm.component_loaded
            ? _c("component-loader", {
                attrs: {
                  slot: "loader",
                  container: true,
                  source: this,
                  error_message: "Error loading series information."
                },
                slot: "loader"
              })
            : _c(
                "div",
                { staticClass: "series-registration-index-page__content" },
                [
                  _c("div", { staticClass: "grid-container" }, [
                    _vm.series_list.length
                      ? _c(
                          "div",
                          { staticClass: "panel-link-group" },
                          _vm._l(_vm.series_list, function(series) {
                            return _c(
                              "a",
                              {
                                key: series.id,
                                staticClass: "panel-link",
                                attrs: { href: series.overview_link }
                              },
                              [
                                _c(
                                  "div",
                                  { staticClass: "panel-link__content" },
                                  [
                                    _c(
                                      "div",
                                      { staticClass: "series-summary" },
                                      [
                                        _c(
                                          "div",
                                          {
                                            staticClass: "series-summary__icon"
                                          },
                                          [
                                            _c("img", {
                                              attrs: {
                                                alt:
                                                  "Series icon for " +
                                                  series.name,
                                                src: series.icon
                                              }
                                            })
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "div",
                                          {
                                            staticClass:
                                              "series-summary__details"
                                          },
                                          [
                                            _c(
                                              "p",
                                              {
                                                staticClass:
                                                  "series-summary__primary"
                                              },
                                              [_vm._v(_vm._s(series.name))]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "p",
                                              {
                                                staticClass:
                                                  "series-summary__secondary"
                                              },
                                              [
                                                _vm._v(
                                                  "\n                                        Application Deadline: " +
                                                    _vm._s(
                                                      series.application_deadline_date_formatted
                                                    ) +
                                                    "\n                                    "
                                                )
                                              ]
                                            )
                                          ]
                                        )
                                      ]
                                    )
                                  ]
                                )
                              ]
                            )
                          })
                        )
                      : _c("p", { staticClass: "alert" }, [
                          _vm._v(
                            "\n                    No series are available at this time.\n                "
                          )
                        ])
                  ])
                ]
              )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=template&id=195e07a0&":
/*!********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=template&id=195e07a0& ***!
  \********************************************************************************************************************************************************************************************************************************************/
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
    "page",
    {
      staticClass: "series-registration-select-team-page",
      class: { "page--accent": _vm.component_loaded },
      attrs: { header: _vm.page_header }
    },
    [
      _vm.component_loaded
        ? _c("series-page-header", {
            attrs: { slot: "pre-header", series: _vm.series },
            slot: "pre-header"
          })
        : _vm._e(),
      _vm._v(" "),
      _c(
        "p",
        {
          staticClass: "page-heading__intro",
          attrs: { slot: "header-content" },
          slot: "header-content"
        },
        [
          _vm._v(
            "\n        If you do not see the team listed, verify the team’s membership has been renewed and you are indicated as\n        either Coach or Team Manager.\n    "
          )
        ]
      ),
      _vm._v(" "),
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              slot: "loader",
              container: true,
              source: this,
              error_message: "Error loading teams."
            },
            slot: "loader"
          })
        : _c(
            "div",
            { staticClass: "page__accent-content grid-container" },
            [
              _vm.teams.length
                ? _c("select-team-list", {
                    attrs: { teams: _vm.teams },
                    scopedSlots: _vm._u([
                      {
                        key: "button",
                        fn: function(ref) {
                          var team = ref.team
                          return _c(
                            "a",
                            {
                              staticClass:
                                "button button--block button--info button--block",
                              attrs: { href: team.select_button.url }
                            },
                            [
                              _vm._t(
                                "button-text",
                                [
                                  _vm._v(
                                    "\n                    " +
                                      _vm._s(team.select_button.text) +
                                      "\n                "
                                  )
                                ],
                                { team: team }
                              )
                            ],
                            2
                          )
                        }
                      }
                    ])
                  })
                : _c(
                    "p",
                    {
                      staticClass:
                        "series-registration-select-team-page__notice text--alert"
                    },
                    [
                      _vm._v(
                        "\n            You don't manage any teams eligible to apply for this series.\n        "
                      )
                    ]
                  )
            ],
            1
          )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647& ***!
  \******************************************************************************************************************************************************************************************************************/
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
    { staticClass: "select-team-list" },
    _vm._l(_vm.teams, function(team) {
      return _c(
        "div",
        {
          key: team.id,
          staticClass: "card select-team-card",
          class: {
            "select-team-card--no-level": !team.level
          }
        },
        [
          _c("div", { staticClass: "select-team-card__content" }, [
            _c("div", { staticClass: "select-team-card__data" }, [
              _c("h3", { staticClass: "select-team-card__title" }, [
                _vm._v(
                  "\n                    " +
                    _vm._s(team.name) +
                    "\n                "
                )
              ]),
              _vm._v(" "),
              team.level
                ? _c("h4", { staticClass: "select-team-card__level" }, [
                    _vm._v(
                      "\n                    " +
                        _vm._s(team.level) +
                        "\n                "
                    )
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c(
                "ul",
                { staticClass: "select-team-card__data-list label-list" },
                [
                  _c("li", [
                    _c("span", { staticClass: "label-list__label" }, [
                      _vm._v(
                        "\n                            Member:\n                        "
                      )
                    ]),
                    _vm._v(" "),
                    _c("span", [
                      _vm._v(
                        "\n                            #" +
                          _vm._s(team.member_number) +
                          "\n                        "
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("li", [
                    _c("span", { staticClass: "label-list__label" }, [
                      _vm._v(
                        "\n                            Membership End Date:\n                        "
                      )
                    ]),
                    _vm._v(" "),
                    _c("span", [
                      _vm._v(
                        "\n                            " +
                          _vm._s(
                            team.membership_status.validity_date_formatted
                          ) +
                          "\n                            "
                      ),
                      !team.membership_status.active
                        ? _c("span", { staticClass: "text--error" }, [
                            _vm._v("Expired")
                          ])
                        : _vm._e()
                    ])
                  ])
                ]
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "select-team-card__cta" },
              [
                team.is_selectable
                  ? _vm._t(
                      "button",
                      [
                        _c(
                          "button",
                          {
                            staticClass:
                              "button button--block button--info button--block",
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                $event.stopPropagation()
                                _vm.selectTeam(team)
                              }
                            }
                          },
                          [
                            _vm._t(
                              "button-text",
                              [
                                _vm._v(
                                  "\n                            Select\n                        "
                                )
                              ],
                              { team: team }
                            )
                          ],
                          2
                        )
                      ],
                      { team: team }
                    )
                  : _c(
                      "span",
                      {
                        staticClass:
                          "member-result-notice member-result-notice--alert"
                      },
                      [
                        _c(
                          "span",
                          { staticClass: "member-result-notice__icon" },
                          [_vm._v(" ")]
                        ),
                        _vm._v(" "),
                        team.not_selectable_reason && team.not_selectable_link
                          ? _c(
                              "a",
                              {
                                staticClass: "member-result-notice__text",
                                attrs: {
                                  href: team.not_selectable_link,
                                  target: "_blank",
                                  rel: "noreferrer noopener"
                                }
                              },
                              [_vm._v(_vm._s(team.not_selectable_reason))]
                            )
                          : team.not_selectable_reason
                          ? _c(
                              "span",
                              { staticClass: "member-result-notice__text" },
                              [_vm._v(_vm._s(team.not_selectable_reason))]
                            )
                          : _vm._e()
                      ]
                    )
              ],
              2
            )
          ])
        ]
      )
    })
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=template&id=57274bee&":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=template&id=57274bee& ***!
  \******************************************************************************************************************************************************************************************************************************/
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
  return  true
    ? _c(
        "site-takeover",
        {
          attrs: { return_to_scroll_location: true },
          on: {
            close: function($event) {
              _vm.memberSearchClose()
            }
          }
        },
        [
          _c(
            "div",
            { staticClass: "member-search-takeover" },
            [
              _c("h2", { staticClass: "site-takeover__title" }, [
                _vm._v(
                  "\n            " +
                    _vm._s(_vm.heading_entity) +
                    " Search " +
                    _vm._s(_vm.results_active ? "Results" : "") +
                    "\n        "
                )
              ]),
              _vm._v(" "),
              _c("member-search")
            ],
            1
          )
        ]
      )
    : undefined
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/SkateTests/SkateTests.vue?vue&type=template&id=6d561693&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/SkateTests/SkateTests.vue?vue&type=template&id=6d561693& ***!
  \******************************************************************************************************************************************************************************************************************/
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
    { staticClass: "skate-tests" },
    [
      _c(
        "div",
        { staticClass: "skate-tests__history" },
        [
          _c("skate-test-history", {
            inlineTemplate: {
              render: function() {
                var _vm = this
                var _h = _vm.$createElement
                var _c = _vm._self._c || _h
                return _c(
                  "div",
                  { staticClass: "skate-test-history" },
                  _vm._l(_vm.disciplines, function(discipline, index) {
                    return _c(
                      "div",
                      {
                        key: index,
                        staticClass: "skate-test-history__section"
                      },
                      [
                        _c(
                          "div",
                          { staticClass: "skate-test-history__section-header" },
                          [
                            _c(
                              "h6",
                              {
                                staticClass:
                                  "skate-test-history__section-header__name"
                              },
                              [
                                _vm._v(
                                  "\n                            " +
                                    _vm._s(discipline.label) +
                                    "\n                        "
                                )
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "div",
                              {
                                staticClass:
                                  "skate-test-history__section-header__actions"
                              },
                              [
                                index === 0
                                  ? _c(
                                      "span",
                                      {
                                        staticClass:
                                          "skate-test-history__section-header__actions__help-text",
                                        attrs: {
                                          disabled: _vm.disableDisciplineActions(
                                            discipline
                                          )
                                        }
                                      },
                                      [_vm._v("Tap to add")]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                _c(
                                  "button",
                                  {
                                    staticClass:
                                      "icon-button icon-button--add icon-button--lg",
                                    attrs: {
                                      disabled: _vm.disableDisciplineActions(
                                        discipline
                                      )
                                    },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.addTest(discipline)
                                      }
                                    }
                                  },
                                  [
                                    _c("span", { staticClass: "sr-only" }, [
                                      _vm._v("Add")
                                    ])
                                  ]
                                )
                              ]
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _vm._l(discipline.key_test, function(
                          skate_test,
                          test_index
                        ) {
                          return _c("div", { key: test_index }, [
                            _c(
                              "div",
                              {
                                staticClass: "skate-test-history__existing-test"
                              },
                              [
                                _c(
                                  "button",
                                  {
                                    staticClass:
                                      "skate-test-history__existing-test__button icon-button icon-button--delete",
                                    style: {
                                      visibility: skate_test.is_self_reported
                                        ? "visible"
                                        : "hidden"
                                    },
                                    attrs: {
                                      disabled: !skate_test.is_self_reported
                                    },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.removeTest(discipline, skate_test, [
                                          index,
                                          test_index
                                        ])
                                      }
                                    }
                                  },
                                  [
                                    _c("span", { staticClass: "sr-only" }, [
                                      _vm._v("Remove")
                                    ])
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "span",
                                  {
                                    staticClass:
                                      "skate-test-history__existing-test__name"
                                  },
                                  [
                                    _vm._v(
                                      "\n                                " +
                                        _vm._s(skate_test.name) +
                                        "\n                            "
                                    )
                                  ]
                                )
                              ]
                            ),
                            _vm._v(" "),
                            _vm.testError([index, test_index])
                              ? _c("p", { staticClass: "input-error" }, [
                                  _vm._v(
                                    "\n                            " +
                                      _vm._s(
                                        _vm.testError([index, test_index])
                                      ) +
                                      "\n                        "
                                  )
                                ])
                              : _vm._e()
                          ])
                        })
                      ],
                      2
                    )
                  })
                )
              },
              staticRenderFns: []
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _vm.overlayActive()
        ? _c(
            "site-takeover",
            {
              staticClass: "site-takeover--accent",
              attrs: { return_to_scroll_location: true },
              on: {
                close: function($event) {
                  _vm.closeOverlay()
                }
              }
            },
            [
              _c("div", [
                _c(
                  "div",
                  { staticClass: "site-takeover--accent__standard-content" },
                  [
                    _c("h2", { staticClass: "site-takeover__title" }, [
                      _vm._v(
                        "\n                    " +
                          _vm._s(_vm.takeover_title) +
                          "\n                "
                      )
                    ])
                  ]
                ),
                _vm._v(" "),
                _c("div", { staticClass: "skate-test-takeover" }, [
                  _c(
                    "div",
                    {
                      staticClass:
                        "skate-test-takeover__section skate-test-takeover__section--add-form"
                    },
                    [
                      _c(
                        "div",
                        { staticClass: "grid-container" },
                        [
                          _c("skate-test-discipline-form", {
                            attrs: {
                              form_test_options: _vm.active_test_options,
                              is_equivalency: false,
                              external_error: _vm.test_submit_error,
                              submitting: _vm.submitting_test,
                              allow_cancel: true,
                              club_autosuggest:
                                _vm.club_autosuggest_configuration
                            },
                            on: {
                              cancel: function($event) {
                                _vm.closeOverlay()
                              },
                              complete: _vm.completeSkateTest
                            },
                            inlineTemplate: {
                              render: function() {
                                var _vm = this
                                var _h = _vm.$createElement
                                var _c = _vm._self._c || _h
                                return _c(
                                  "div",
                                  { staticClass: "skate-test-discipline-form" },
                                  [
                                    !_vm.component_loaded
                                      ? _c("div", [
                                          _vm.load_error
                                            ? _c(
                                                "p",
                                                { staticClass: "text--alert" },
                                                [
                                                  _vm._v(
                                                    "\n                                        Error loading form.\n                                    "
                                                  )
                                                ]
                                              )
                                            : !_vm.loaded && _vm.loading_timeout
                                            ? _c("p", [
                                                _vm._v(
                                                  "\n                                        Loading form...\n                                    "
                                                )
                                              ])
                                            : _vm._e()
                                        ])
                                      : _c("div", [
                                          _c(
                                            "div",
                                            { staticClass: "form-group" },
                                            [
                                              _c(
                                                "label",
                                                {
                                                  staticClass: "field-label",
                                                  attrs: { for: "test" }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                            Test\n                                        "
                                                  )
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "select",
                                                {
                                                  directives: [
                                                    {
                                                      name: "model",
                                                      rawName: "v-model",
                                                      value: _vm.form_data.test,
                                                      expression:
                                                        "form_data.test"
                                                    }
                                                  ],
                                                  staticClass: "form-field",
                                                  class: _vm.fieldClass("test"),
                                                  attrs: { id: "test" },
                                                  on: {
                                                    change: function($event) {
                                                      var $$selectedVal = Array.prototype.filter
                                                        .call(
                                                          $event.target.options,
                                                          function(o) {
                                                            return o.selected
                                                          }
                                                        )
                                                        .map(function(o) {
                                                          var val =
                                                            "_value" in o
                                                              ? o._value
                                                              : o.value
                                                          return val
                                                        })
                                                      _vm.$set(
                                                        _vm.form_data,
                                                        "test",
                                                        $event.target.multiple
                                                          ? $$selectedVal
                                                          : $$selectedVal[0]
                                                      )
                                                    }
                                                  }
                                                },
                                                [
                                                  _c(
                                                    "option",
                                                    {
                                                      attrs: {
                                                        disabled: "",
                                                        selected: ""
                                                      },
                                                      domProps: { value: null }
                                                    },
                                                    [
                                                      _vm._v(
                                                        "\n                                                Select Test\n                                            "
                                                      )
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _vm._l(
                                                    _vm.test_options,
                                                    function(
                                                      test_option,
                                                      test_index
                                                    ) {
                                                      return _c(
                                                        "option",
                                                        {
                                                          key: test_index,
                                                          attrs: {
                                                            disabled:
                                                              test_option.value ===
                                                              null
                                                          },
                                                          domProps: {
                                                            value: test_option
                                                          }
                                                        },
                                                        [
                                                          _vm._v(
                                                            "\n                                                " +
                                                              _vm._s(
                                                                test_option.label
                                                              ) +
                                                              "\n                                            "
                                                          )
                                                        ]
                                                      )
                                                    }
                                                  )
                                                ],
                                                2
                                              ),
                                              _vm._v(" "),
                                              _vm.fieldMessage("test")
                                                ? _c(
                                                    "p",
                                                    {
                                                      staticClass: "input-error"
                                                    },
                                                    [
                                                      _vm._v(
                                                        "\n                                            *" +
                                                          _vm._s(
                                                            _vm.fieldMessage(
                                                              "test"
                                                            )
                                                          ) +
                                                          "\n                                        "
                                                      )
                                                    ]
                                                  )
                                                : _vm._e()
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "div",
                                            { staticClass: "form-group" },
                                            [
                                              _c(
                                                "label",
                                                {
                                                  staticClass: "field-label",
                                                  attrs: { for: "club" }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                            Club\n                                        "
                                                  )
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _vm.show_auto_suggest
                                                ? _c("auto-suggest", {
                                                    attrs: {
                                                      initial_value: {
                                                        label:
                                                          _vm.form_data.club,
                                                        value:
                                                          _vm.form_data.club_id
                                                      },
                                                      restricted:
                                                        _vm.club_autosuggest
                                                          .restrict,
                                                      options: _vm.clubs,
                                                      input_attrs: {
                                                        id: "club",
                                                        class: [
                                                          _vm.fieldClass(
                                                            "club"
                                                          ),
                                                          "form-field"
                                                        ],
                                                        type: "text",
                                                        autocomplete: "off"
                                                      }
                                                    },
                                                    on: {
                                                      input: _vm.clubChange
                                                    }
                                                  })
                                                : _c("input", {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model",
                                                        value:
                                                          _vm.form_data.club,
                                                        expression:
                                                          "form_data.club"
                                                      }
                                                    ],
                                                    staticClass: "form-field",
                                                    class: _vm.fieldClass(
                                                      "club"
                                                    ),
                                                    attrs: {
                                                      id: "club",
                                                      type: "text"
                                                    },
                                                    domProps: {
                                                      value: _vm.form_data.club
                                                    },
                                                    on: {
                                                      input: function($event) {
                                                        if (
                                                          $event.target
                                                            .composing
                                                        ) {
                                                          return
                                                        }
                                                        _vm.$set(
                                                          _vm.form_data,
                                                          "club",
                                                          $event.target.value
                                                        )
                                                      }
                                                    }
                                                  }),
                                              _vm._v(" "),
                                              _vm.fieldMessage("club")
                                                ? _c(
                                                    "p",
                                                    {
                                                      staticClass: "input-error"
                                                    },
                                                    [
                                                      _vm._v(
                                                        "\n                                            *" +
                                                          _vm._s(
                                                            _vm.fieldMessage(
                                                              "club"
                                                            )
                                                          ) +
                                                          "\n                                        "
                                                      )
                                                    ]
                                                  )
                                                : _vm._e()
                                            ],
                                            1
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "div",
                                            { staticClass: "form-group" },
                                            [
                                              _c(
                                                "label",
                                                {
                                                  staticClass: "field-label",
                                                  attrs: { for: "date" }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                            Date\n                                        "
                                                  )
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c("date-input", {
                                                class: _vm.fieldClass("date"),
                                                attrs: {
                                                  id: "date",
                                                  placeholder: "mm/dd/yyyy",
                                                  initial: _vm.form_data.date
                                                },
                                                model: {
                                                  value: _vm.form_data.date,
                                                  callback: function($$v) {
                                                    _vm.$set(
                                                      _vm.form_data,
                                                      "date",
                                                      $$v
                                                    )
                                                  },
                                                  expression: "form_data.date"
                                                }
                                              }),
                                              _vm._v(" "),
                                              _vm.fieldMessage("date")
                                                ? _c(
                                                    "p",
                                                    {
                                                      staticClass: "input-error"
                                                    },
                                                    [
                                                      _vm._v(
                                                        "\n                                            *" +
                                                          _vm._s(
                                                            _vm.fieldMessage(
                                                              "date"
                                                            )
                                                          ) +
                                                          "\n                                        "
                                                      )
                                                    ]
                                                  )
                                                : _vm._e()
                                            ],
                                            1
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "div",
                                            { staticClass: "form-actions" },
                                            [
                                              _vm.external_error
                                                ? _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-actions__column form-actions__column--full form-actions__column--notice"
                                                    },
                                                    [
                                                      _c(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "input-error"
                                                        },
                                                        [
                                                          _vm._v(
                                                            "\n                                                " +
                                                              _vm._s(
                                                                _vm.external_error
                                                              ) +
                                                              "\n                                            "
                                                          )
                                                        ]
                                                      )
                                                    ]
                                                  )
                                                : _vm._e(),
                                              _vm._v(" "),
                                              _vm.allow_cancel
                                                ? _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-actions__column form-actions__column--sm"
                                                    },
                                                    [
                                                      _c(
                                                        "button",
                                                        {
                                                          staticClass:
                                                            "button button--info button--block",
                                                          attrs: {
                                                            type: "button"
                                                          },
                                                          on: {
                                                            click: function(
                                                              $event
                                                            ) {
                                                              $event.preventDefault()
                                                              _vm.cancel()
                                                            }
                                                          }
                                                        },
                                                        [
                                                          _vm._v(
                                                            "\n                                                Cancel\n                                            "
                                                          )
                                                        ]
                                                      )
                                                    ]
                                                  )
                                                : _vm._e(),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "form-actions__column form-actions__column--lg",
                                                  class: _vm.allow_cancel
                                                    ? "form-actions__column--lg"
                                                    : "form-actions__column--full"
                                                },
                                                [
                                                  _c(
                                                    "button",
                                                    {
                                                      staticClass:
                                                        "button button--block",
                                                      attrs: {
                                                        type: "button",
                                                        disabled: _vm.submitting
                                                      },
                                                      on: {
                                                        click: function(
                                                          $event
                                                        ) {
                                                          $event.preventDefault()
                                                          _vm.complete()
                                                        }
                                                      }
                                                    },
                                                    [
                                                      _vm._v(
                                                        "\n                                                " +
                                                          _vm._s(
                                                            _vm.submitting
                                                              ? "Saving"
                                                              : "Save"
                                                          ) +
                                                          "\n                                            "
                                                      )
                                                    ]
                                                  )
                                                ]
                                              )
                                            ]
                                          )
                                        ])
                                  ]
                                )
                              },
                              staticRenderFns: []
                            }
                          })
                        ],
                        1
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass:
                        "skate-test-takeover__section skate-test-takeover__section--self-reported"
                    },
                    [
                      _c(
                        "div",
                        { staticClass: "grid-container" },
                        [
                          _c(
                            "h4",
                            {
                              staticClass:
                                "skate-test-takeover__section-heading skate-test-takeover__section-heading--padded"
                            },
                            [
                              _vm._v(
                                "\n                            Delete self-reported tests\n                        "
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c("skate-test-history", {
                            inlineTemplate: {
                              render: function() {
                                var _vm = this
                                var _h = _vm.$createElement
                                var _c = _vm._self._c || _h
                                return _c(
                                  "ul",
                                  {
                                    staticClass:
                                      "skate-test-takeover__self-reported-list"
                                  },
                                  [
                                    _vm._l(
                                      _vm.self_reported_test_disciplines,
                                      function(discipline, index) {
                                        return _c(
                                          "li",
                                          {
                                            key: index,
                                            staticClass:
                                              "skate-test-takeover__self-reported-list__discipline"
                                          },
                                          [
                                            _c(
                                              "ul",
                                              {
                                                staticClass:
                                                  "skate-test-takeover__self-reported-list__discipline__list"
                                              },
                                              _vm._l(
                                                discipline.self_reported_tests,
                                                function(test, test_index) {
                                                  return _c(
                                                    "li",
                                                    {
                                                      key: test_index,
                                                      staticClass:
                                                        "self-reported-test"
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "self-reported-test__heading"
                                                        },
                                                        [
                                                          _c(
                                                            "h5",
                                                            {
                                                              staticClass:
                                                                "self-reported-test__heading__name"
                                                            },
                                                            [
                                                              _vm._v(
                                                                "\n                                                    " +
                                                                  _vm._s(
                                                                    discipline.label
                                                                  ) +
                                                                  "\n                                                "
                                                              )
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "button",
                                                            {
                                                              staticClass:
                                                                "self-reported-test__button icon-button icon-button--delete icon-button--labeled-inline",
                                                              on: {
                                                                click: function(
                                                                  $event
                                                                ) {
                                                                  $event.preventDefault()
                                                                  _vm.removeTest(
                                                                    discipline,
                                                                    test,
                                                                    [
                                                                      index,
                                                                      test_index
                                                                    ]
                                                                  )
                                                                }
                                                              }
                                                            },
                                                            [
                                                              _vm._v(
                                                                "\n                                                    Remove\n                                                "
                                                              )
                                                            ]
                                                          )
                                                        ]
                                                      ),
                                                      _vm._v(" "),
                                                      _c(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "self-reported-test__test-name"
                                                        },
                                                        [
                                                          _vm._v(
                                                            "\n                                                " +
                                                              _vm._s(
                                                                test.name
                                                              ) +
                                                              "\n                                            "
                                                          )
                                                        ]
                                                      ),
                                                      _vm._v(" "),
                                                      _vm.testError([
                                                        index,
                                                        test_index
                                                      ])
                                                        ? _c(
                                                            "p",
                                                            {
                                                              staticClass:
                                                                "input-error"
                                                            },
                                                            [
                                                              _vm._v(
                                                                "\n                                                " +
                                                                  _vm._s(
                                                                    _vm.testError(
                                                                      [
                                                                        index,
                                                                        test_index
                                                                      ]
                                                                    )
                                                                  ) +
                                                                  "\n                                            "
                                                              )
                                                            ]
                                                          )
                                                        : _vm._e()
                                                    ]
                                                  )
                                                }
                                              )
                                            )
                                          ]
                                        )
                                      }
                                    ),
                                    _vm._v(" "),
                                    !_vm.self_reported_test_disciplines.length
                                      ? _c(
                                          "li",
                                          { staticClass: "self-reported-test" },
                                          [
                                            _c(
                                              "span",
                                              {
                                                staticClass:
                                                  "self-reported-test__no-test-notice"
                                              },
                                              [
                                                _vm._v(
                                                  "\n                                        No self-reported tests\n                                    "
                                                )
                                              ]
                                            )
                                          ]
                                        )
                                      : _vm._e()
                                  ],
                                  2
                                )
                              },
                              staticRenderFns: []
                            }
                          })
                        ],
                        1
                      )
                    ]
                  )
                ])
              ])
            ]
          )
        : _vm._e()
    ],
    1
  )
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

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue":
/*!********************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesApplicationCitizenshipNotice_vue_vue_type_template_id_c70b31b6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesApplicationCitizenshipNotice.vue?vue&type=template&id=c70b31b6& */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=template&id=c70b31b6&");
/* harmony import */ var _SeriesApplicationCitizenshipNotice_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesApplicationCitizenshipNotice.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesApplicationCitizenshipNotice_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesApplicationCitizenshipNotice_vue_vue_type_template_id_c70b31b6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesApplicationCitizenshipNotice_vue_vue_type_template_id_c70b31b6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationCitizenshipNotice_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationCitizenshipNotice.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationCitizenshipNotice_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=template&id=c70b31b6&":
/*!***************************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=template&id=c70b31b6& ***!
  \***************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationCitizenshipNotice_vue_vue_type_template_id_c70b31b6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationCitizenshipNotice.vue?vue&type=template&id=c70b31b6& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationCitizenshipNotice.vue?vue&type=template&id=c70b31b6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationCitizenshipNotice_vue_vue_type_template_id_c70b31b6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationCitizenshipNotice_vue_vue_type_template_id_c70b31b6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue":
/*!*************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesApplicationDiscipline_vue_vue_type_template_id_5b638a37___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesApplicationDiscipline.vue?vue&type=template&id=5b638a37& */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=template&id=5b638a37&");
/* harmony import */ var _SeriesApplicationDiscipline_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesApplicationDiscipline.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesApplicationDiscipline_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesApplicationDiscipline_vue_vue_type_template_id_5b638a37___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesApplicationDiscipline_vue_vue_type_template_id_5b638a37___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=script&lang=ts&":
/*!**************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=script&lang=ts& ***!
  \**************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationDiscipline_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationDiscipline.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationDiscipline_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=template&id=5b638a37&":
/*!********************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=template&id=5b638a37& ***!
  \********************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationDiscipline_vue_vue_type_template_id_5b638a37___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationDiscipline.vue?vue&type=template&id=5b638a37& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationDiscipline.vue?vue&type=template&id=5b638a37&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationDiscipline_vue_vue_type_template_id_5b638a37___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationDiscipline_vue_vue_type_template_id_5b638a37___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue":
/*!***************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue ***!
  \***************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_template_id_0a13d43b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=template&id=0a13d43b& */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=template&id=0a13d43b&");
/* harmony import */ var _SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_template_id_0a13d43b___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_template_id_0a13d43b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=script&lang=ts&":
/*!****************************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=script&lang=ts& ***!
  \****************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=template&id=0a13d43b&":
/*!**********************************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=template&id=0a13d43b& ***!
  \**********************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_template_id_0a13d43b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=template&id=0a13d43b& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue?vue&type=template&id=0a13d43b&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_template_id_0a13d43b___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPartnerCitizenshipNotice_vue_vue_type_template_id_0a13d43b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue":
/*!*******************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesApplicationProfileEmailEdit_vue_vue_type_template_id_f125d5b8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesApplicationProfileEmailEdit.vue?vue&type=template&id=f125d5b8& */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=template&id=f125d5b8&");
/* harmony import */ var _SeriesApplicationProfileEmailEdit_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesApplicationProfileEmailEdit.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesApplicationProfileEmailEdit_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesApplicationProfileEmailEdit_vue_vue_type_template_id_f125d5b8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesApplicationProfileEmailEdit_vue_vue_type_template_id_f125d5b8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfileEmailEdit_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationProfileEmailEdit.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfileEmailEdit_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=template&id=f125d5b8&":
/*!**************************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=template&id=f125d5b8& ***!
  \**************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfileEmailEdit_vue_vue_type_template_id_f125d5b8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationProfileEmailEdit.vue?vue&type=template&id=f125d5b8& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationProfileEmailEdit.vue?vue&type=template&id=f125d5b8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfileEmailEdit_vue_vue_type_template_id_f125d5b8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfileEmailEdit_vue_vue_type_template_id_f125d5b8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_models/SeriesApplicationProfileEditFormState.ts":
/*!******************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_models/SeriesApplicationProfileEditFormState.ts ***!
  \******************************************************************************************************/
/*! exports provided: SeriesApplicationProfileEditFormState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesApplicationProfileEditFormState", function() { return SeriesApplicationProfileEditFormState; });
/* harmony import */ var _models_FormState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/FormState */ "./src/js/models/FormState.ts");
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

var SeriesApplicationProfileEditFormState = /** @class */ (function (_super) {
    __extends(SeriesApplicationProfileEditFormState, _super);
    function SeriesApplicationProfileEditFormState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.email = '';
        return _this;
    }
    return SeriesApplicationProfileEditFormState;
}(_models_FormState__WEBPACK_IMPORTED_MODULE_0__["FormState"]));



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_models/SeriesApplicationProfileEditFormValidator.ts":
/*!**********************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_models/SeriesApplicationProfileEditFormValidator.ts ***!
  \**********************************************************************************************************/
/*! exports provided: SeriesApplicationProfileEditFormValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesApplicationProfileEditFormValidator", function() { return SeriesApplicationProfileEditFormValidator; });
/* harmony import */ var _models_FormValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/FormValidator */ "./src/js/models/FormValidator.ts");
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

var SeriesApplicationProfileEditFormValidator = /** @class */ (function (_super) {
    __extends(SeriesApplicationProfileEditFormValidator, _super);
    function SeriesApplicationProfileEditFormValidator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rules = {
            email: ['required', 'email']
        };
        _this.messages = {
            required: 'This field is required',
            email: 'Enter a valid email address'
        };
        return _this;
    }
    return SeriesApplicationProfileEditFormValidator;
}(_models_FormValidator__WEBPACK_IMPORTED_MODULE_0__["FormValidator"]));



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue":
/*!**************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesApplicationPage_vue_vue_type_template_id_02d84974___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesApplicationPage.vue?vue&type=template&id=02d84974& */ "./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=template&id=02d84974&");
/* harmony import */ var _SeriesApplicationPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesApplicationPage.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesApplicationPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesApplicationPage_vue_vue_type_template_id_02d84974___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesApplicationPage_vue_vue_type_template_id_02d84974___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=script&lang=ts&":
/*!***************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=script&lang=ts& ***!
  \***************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationPage.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=template&id=02d84974&":
/*!*********************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=template&id=02d84974& ***!
  \*********************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPage_vue_vue_type_template_id_02d84974___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationPage.vue?vue&type=template&id=02d84974& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue?vue&type=template&id=02d84974&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPage_vue_vue_type_template_id_02d84974___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationPage_vue_vue_type_template_id_02d84974___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue":
/*!*******************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesApplicationApplication_vue_vue_type_template_id_09c336c7___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesApplicationApplication.vue?vue&type=template&id=09c336c7& */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=template&id=09c336c7&");
/* harmony import */ var _SeriesApplicationApplication_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesApplicationApplication.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesApplicationApplication_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesApplicationApplication_vue_vue_type_template_id_09c336c7___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesApplicationApplication_vue_vue_type_template_id_09c336c7___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationApplication_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationApplication.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationApplication_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=template&id=09c336c7&":
/*!**************************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=template&id=09c336c7& ***!
  \**************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationApplication_vue_vue_type_template_id_09c336c7___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationApplication.vue?vue&type=template&id=09c336c7& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationApplication.vue?vue&type=template&id=09c336c7&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationApplication_vue_vue_type_template_id_09c336c7___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationApplication_vue_vue_type_template_id_09c336c7___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue":
/*!***************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesApplicationProfile_vue_vue_type_template_id_631e2e20___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesApplicationProfile.vue?vue&type=template&id=631e2e20& */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=template&id=631e2e20&");
/* harmony import */ var _SeriesApplicationProfile_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesApplicationProfile.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesApplicationProfile_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesApplicationProfile_vue_vue_type_template_id_631e2e20___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesApplicationProfile_vue_vue_type_template_id_631e2e20___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=script&lang=ts&":
/*!****************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=script&lang=ts& ***!
  \****************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfile_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationProfile.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfile_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=template&id=631e2e20&":
/*!**********************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=template&id=631e2e20& ***!
  \**********************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfile_vue_vue_type_template_id_631e2e20___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationProfile.vue?vue&type=template&id=631e2e20& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationProfile.vue?vue&type=template&id=631e2e20&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfile_vue_vue_type_template_id_631e2e20___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationProfile_vue_vue_type_template_id_631e2e20___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue":
/*!*******************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesApplicationTeamProfile_vue_vue_type_template_id_3c512003___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesApplicationTeamProfile.vue?vue&type=template&id=3c512003& */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=template&id=3c512003&");
/* harmony import */ var _SeriesApplicationTeamProfile_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesApplicationTeamProfile.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesApplicationTeamProfile_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesApplicationTeamProfile_vue_vue_type_template_id_3c512003___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesApplicationTeamProfile_vue_vue_type_template_id_3c512003___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationTeamProfile_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationTeamProfile.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationTeamProfile_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=template&id=3c512003&":
/*!**************************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=template&id=3c512003& ***!
  \**************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationTeamProfile_vue_vue_type_template_id_3c512003___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesApplicationTeamProfile.vue?vue&type=template&id=3c512003& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesApplication/_pages/_partials/SeriesApplicationTeamProfile.vue?vue&type=template&id=3c512003&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationTeamProfile_vue_vue_type_template_id_3c512003___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesApplicationTeamProfile_vue_vue_type_template_id_3c512003___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_services/SeriesApplicationAPIService.ts":
/*!**********************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_services/SeriesApplicationAPIService.ts ***!
  \**********************************************************************************************/
/*! exports provided: SeriesApplicationAPIService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesApplicationAPIService", function() { return SeriesApplicationAPIService; });
/* harmony import */ var _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/AbstractAPIService */ "./src/js/services/AbstractAPIService.ts");
/* harmony import */ var _services_MemberSearchService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../services/MemberSearchService */ "./src/js/services/MemberSearchService.ts");
/* harmony import */ var _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor */ "./src/js/adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor.ts");
/* harmony import */ var _transformers_SeriesApplicationAPITransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_transformers/SeriesApplicationAPITransformer */ "./src/js/SeriesRegistration/SeriesApplication/_transformers/SeriesApplicationAPITransformer.ts");
/* harmony import */ var _services_SeriesRegistrationAPIService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../_services/SeriesRegistrationAPIService */ "./src/js/SeriesRegistration/_services/SeriesRegistrationAPIService.ts");
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





var SeriesApplicationAPIService = /** @class */ (function (_super) {
    __extends(SeriesApplicationAPIService, _super);
    function SeriesApplicationAPIService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fetch Series information for the Series Application page
     */
    SeriesApplicationAPIService.fetchSeriesApplication = function () {
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var team_id = SeriesApplicationAPIService.getActiveTeamId();
        if (team_id) {
            return SeriesApplicationAPIService.fetchSeriesApplicationTeam(series_id, team_id);
        }
        return this.fetchAndTransformResponse({
            url: "/api/series-registration/" + series_id + "/application",
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data) {
                return _transformers_SeriesApplicationAPITransformer__WEBPACK_IMPORTED_MODULE_3__["SeriesApplicationAPITransformer"].transformFetchSeriesRegistrationSeriesApplication(response_data);
            }
        });
    };
    /**
     * Fetch Series information for the Series Application page (Team)
     */
    SeriesApplicationAPIService.fetchSeriesApplicationTeam = function (series_id, team_id) {
        return this.fetchAndTransformResponse({
            url: "/api/series-registration/" + series_id + "/teams/" + team_id + "/application",
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data) {
                return _transformers_SeriesApplicationAPITransformer__WEBPACK_IMPORTED_MODULE_3__["SeriesApplicationAPITransformer"].transformFetchSeriesRegistrationSeriesApplicationTeam(response_data);
            }
        });
    };
    /**
     * Update the active user's profile information relative to a series application
     */
    SeriesApplicationAPIService.updateUserProfile = function (payload) {
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var url = "/api/series-registration/" + series_id + "/profile";
        var api_payload = payload;
        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating email address',
            method: 'patch',
            payload: api_payload,
            url: url
        });
    };
    /**
     * Fetch the state options for coach search
     */
    SeriesApplicationAPIService.fetchCoachSearchStateOptions = function () {
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var url = "/api/series-registration/" + series_id + "/coach-search";
        return this.fetchAndTransformResponse({
            url: url,
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data) {
                return response_data.states;
            }
        });
    };
    /**
     * Fetch the state options for coach search
     */
    SeriesApplicationAPIService.fetchPartnerSearchStateOptions = function () {
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var url = "/api/series-registration/" + series_id + "/partner-search";
        return this.fetchAndTransformResponse({
            url: url,
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data) {
                return response_data.states;
            }
        });
    };
    /**
     * Run the coach search
     */
    SeriesApplicationAPIService.coachSearch = function (search_params) {
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var url = "/api/series-registration/" + series_id + "/coach-search";
        return _services_MemberSearchService__WEBPACK_IMPORTED_MODULE_1__["MemberSearchService"].memberSearch(search_params, url);
    };
    /**
     * Run the partner search
     */
    SeriesApplicationAPIService.partnerSearch = function (search_params, discipline_id) {
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var url = "/api/series-registration/" + series_id + "/partner-search/discipline/" + discipline_id;
        return _services_MemberSearchService__WEBPACK_IMPORTED_MODULE_1__["MemberSearchService"].memberSearch(search_params, url);
    };
    /**
     * Save a skate test for a series application
     */
    SeriesApplicationAPIService.saveSkateTest = function (test_data, discipline_key) {
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var error_message = 'Error saving skate test.';
        var url = "/api/series-registration/" + series_id + "/skate-test-history";
        var payload = {
            test_data: _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__["SkateTestHistoryAPIAdaptor"].adaptSkateTestFormDataToIndividualSkateTestData(test_data),
            discipline_key: discipline_key
        };
        return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].submitWithTransformedResponse({
            error_message: error_message,
            method: 'post',
            payload: payload,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data) {
                return {
                    skate_test_history: _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__["SkateTestHistoryAPIAdaptor"].adaptUserSkateTestHistoryDataToUserSkateTestHistory(response_data.skate_test_history),
                    user_discipline_eligibility_update: response_data.user_discipline_eligibility_update ? response_data.user_discipline_eligibility_update.slice() : []
                };
            },
            url: url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            validateResponse: function (response_data) {
                return !!response_data && response_data.success && !!response_data.skate_test_history;
            }
        });
    };
    /**
     * Remove a skate test for a series application
     */
    SeriesApplicationAPIService.removeSkateTest = function (app_payload) {
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var error_message = 'Error removing skate test.';
        var url = "/api/series-registration/" + series_id + "/skate-test-history";
        var payload = _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__["SkateTestHistoryAPIAdaptor"].adaptSkateTestRemoveAppPayloadToSkateTestRemoveAPIPayload(app_payload);
        return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].submitWithTransformedResponse({
            error_message: error_message,
            method: 'delete',
            payload: payload,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data) {
                return {
                    skate_test_history: _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__["SkateTestHistoryAPIAdaptor"].adaptUserSkateTestHistoryDataToUserSkateTestHistory(response_data.skate_test_history),
                    user_discipline_eligibility_update: response_data.user_discipline_eligibility_update ? response_data.user_discipline_eligibility_update.slice() : []
                };
            },
            url: url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            validateResponse: function (response_data) {
                return !!response_data && response_data.success && !!response_data.skate_test_history;
            }
        });
    };
    /**
     * Save a series application
     */
    SeriesApplicationAPIService.saveApplication = function (app_payload) {
        var payload = _transformers_SeriesApplicationAPITransformer__WEBPACK_IMPORTED_MODULE_3__["SeriesApplicationAPITransformer"].transformSaveSeriesApplication(app_payload);
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var url = "/api/series-registration/" + series_id + "/application";
        return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].submitWithTransformedResponse({
            error_message: 'Error saving application.',
            method: 'post',
            payload: payload,
            url: url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data) {
                return {
                    cart_link: response_data.cart_link
                };
            }
        });
    };
    /**
     * Save a series application
     */
    SeriesApplicationAPIService.saveApplicationTeam = function (app_payload) {
        var payload = _transformers_SeriesApplicationAPITransformer__WEBPACK_IMPORTED_MODULE_3__["SeriesApplicationAPITransformer"].transformSaveSeriesApplicationTeam(app_payload);
        var series_id = SeriesApplicationAPIService.getActiveSeriesId();
        var team_id = SeriesApplicationAPIService.getActiveTeamId(false);
        var url = "/api/series-registration/" + series_id + "/teams/" + team_id + "/application";
        return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].submitWithTransformedResponse({
            error_message: 'Error saving application.',
            method: 'post',
            payload: payload,
            url: url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data) {
                return {
                    cart_link: response_data.cart_link
                };
            }
        });
    };
    return SeriesApplicationAPIService;
}(_services_SeriesRegistrationAPIService__WEBPACK_IMPORTED_MODULE_4__["SeriesRegistrationAPIService"]));



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_store/SeriesApplicationState.ts":
/*!**************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_store/SeriesApplicationState.ts ***!
  \**************************************************************************************/
/*! exports provided: State, SeriesApplicationState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesApplicationState", function() { return SeriesApplicationState; });
/* harmony import */ var _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/SeriesApplicationAPIService */ "./src/js/SeriesRegistration/SeriesApplication/_services/SeriesApplicationAPIService.ts");
/* harmony import */ var _store_Modules_MemberSearchState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../store/Modules/MemberSearchState */ "./src/js/store/Modules/MemberSearchState.ts");
/* harmony import */ var _components_MemberSearch_MemberSearchValidators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/MemberSearch/MemberSearchValidators */ "./src/js/components/MemberSearch/MemberSearchValidators.ts");
/* harmony import */ var _components_MemberSearch_MemberSearchValidationFunctionFactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../components/MemberSearch/MemberSearchValidationFunctionFactory */ "./src/js/components/MemberSearch/MemberSearchValidationFunctionFactory.ts");
/* harmony import */ var _components_SeriesApplicationPartnerCitizenshipNotice_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_components/SeriesApplicationPartnerCitizenshipNotice.vue */ "./src/js/SeriesRegistration/SeriesApplication/_components/SeriesApplicationPartnerCitizenshipNotice.vue");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};





/**
 * @future_optimization: extract SeriesApplicationSearch state to handle partner and coach searching
 */
var State = /** @class */ (function () {
    function State() {
        /**
         * The active type of the active member search.  Null if no member search is active
         */
        this.active_search_type = null;
        /**
         * The teams that have been applied for the series
         */
        this.applied_teams = null;
        /**
         * Coach search state options.  Saved to prevent repeated API calls for same data
         */
        this.coach_search_state_options = [];
        this.is_team_series = false;
        /**
         * Partner search state options.  Saved to prevent repeated API calls for same data
         */
        this.partner_search_state_options = [];
        /**
         * Whether a saved application exists for the current user
         */
        this.saved_application_exists = true;
        /**
         * The active series
         */
        this.series = null;
        /**
         * Active user application
         */
        this.user_application = null;
        /**
         * Active series application user profile
         */
        this.user_profile = null;
        /**
         * Active series application user profile
         */
        this.team_profile = null;
    }
    return State;
}());

var actions = {
    /**
     * Save the current application
     */
    save: function (context) {
        var service_method = context.state.is_team_series ? _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].saveApplicationTeam : _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].saveApplication;
        var service_payload = context.getters.application_save_payload;
        return new Promise(function (resolve, reject) {
            service_method(service_payload)
                .then(function (response) {
                resolve(response.cart_link);
            })
                .catch(function (message) {
                reject(message);
            });
        });
    },
    /**
     * Close member search, either for coaches or partners
     */
    closeSearch: function (context) {
        context.commit('setActiveSearchType', null);
    },
    /**
     * Fetch the search form options for coach search
     */
    fetchCoachSearchFormOptions: function (context) {
        return new Promise(function (resolve, reject) {
            var stateFormOptions = context.state.coach_search_state_options;
            if (stateFormOptions.length) {
                resolve(stateFormOptions);
                return;
            }
            _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].fetchCoachSearchStateOptions()
                .then(function (result) {
                resolve(result);
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch the search form options for partner search
     */
    fetchPartnerSearchFormOptions: function (context) {
        return new Promise(function (resolve, reject) {
            var stateFormOptions = context.state.partner_search_state_options;
            if (stateFormOptions.length) {
                resolve(stateFormOptions);
                return;
            }
            _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].fetchPartnerSearchStateOptions()
                .then(function (result) {
                resolve(result);
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch the series application page data
     */
    fetchSeriesApplication: function (context) {
        return new Promise(function (resolve, reject) {
            _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].fetchSeriesApplication()
                .then(function (result) {
                context.commit('setSeries', result.series);
                context.commit('setIsTeamSeries', result.is_team_series);
                context.commit('setUserApplication', result.user_application);
                context.commit('setUserProfile', result.user_application_profile);
                context.commit('setTeamProfile', result.team_application_profile);
                context.commit('setSavedApplicationExists', result.saved_application_exists);
                if (!result.is_team_series) {
                    context.commit('skate_test_history/setActiveSkateTestHistory', result.user_application_profile.skate_test_history, { root: true });
                }
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Handle a change in eligibility
     *
     * 1. Following eligible level changes, remove all unpaid levels user is no longer eligible for
     */
    handleEligibilityChange: function (context) {
        var userApplication = context.state.user_application;
        var discipline_levels_to_remove = [];
        if (!userApplication) {
            return;
        }
        var disciplines = userApplication.disciplines;
        /**
         * Loop over application disciplines
         */
        for (var i = 0; i < disciplines.length; i++) {
            var discipline = disciplines[i];
            var eligible_discipline_levels = context.getters.user_selectable_discipline_levels(discipline);
            // eslint-disable-next-line arrow-parens,arrow-body-style
            var eligible_level_ids = eligible_discipline_levels.map(function (level) { return level.id; });
            /**
             * Loop over discipline selected levels
             */
            for (var j = 0; j < discipline.levels.length; j++) {
                var level = discipline.levels[j];
                /**
                 * If level is no longer available to the user and it hasn't been paid for, add it to the list of levels to remove
                 */
                if (!level.is_paid && eligible_level_ids.indexOf(level.id) === -1) {
                    discipline_levels_to_remove.push({
                        discipline: discipline,
                        level: level
                    });
                }
            }
        }
        /**
         * Remove all flagged levels
         */
        for (var i = 0; i < discipline_levels_to_remove.length; i++) {
            var payload = discipline_levels_to_remove[i];
            context.dispatch('removeLevel', payload);
        }
    },
    /**
     * Initiate searching for a coach
     */
    openCoachSearch: function (context, discipline) {
        /**
         * Ensure state module is registered
         */
        if (!this.state.member_search) {
            this.registerModule('member_search', _store_Modules_MemberSearchState__WEBPACK_IMPORTED_MODULE_1__["MemberSearchState"]);
        }
        /**
         * Get the search form options
         */
        context.dispatch('fetchCoachSearchFormOptions')
            .then(function (result) {
            context.commit('member_search/setStateOptions', result, { root: true });
            context.commit('setCoachSearchStateOptions', result);
        })
            .catch(function () {
            // fail silently
        });
        /**
         * Configure the member search
         */
        var config = {
            search_function: _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].coachSearch,
            selection_method: function (result) {
                return context.dispatch('selectCoach', {
                    result: result,
                    discipline: discipline
                });
            },
            close_method: function () {
                context.dispatch('closeSearch');
            },
            ineligible_instruction: 'Please choose another coach or leave blank.',
            entity_descriptor: 'Coach',
            result_validators: [_components_MemberSearch_MemberSearchValidators__WEBPACK_IMPORTED_MODULE_2__["validateResultActive"]]
        };
        context.commit('member_search/configure', config, { root: true });
        /**
         * Prevent selection of duplicate coaches for the same discipline
         */
        context.commit('member_search/setBlockedPreviousSelection', discipline.coaches.map(function (coach) {
            return coach.id;
        }), { root: true });
        /**
         * Update state to indicate coach search is active
         */
        context.commit('setActiveSearchType', 'coach');
    },
    /**
     * Initiate searching for a partner
     */
    openPartnerSearch: function (context, discipline) {
        if (!this.state.member_search) {
            this.registerModule('member_search', _store_Modules_MemberSearchState__WEBPACK_IMPORTED_MODULE_1__["MemberSearchState"]);
        }
        context.dispatch('fetchPartnerSearchFormOptions')
            .then(function (result) {
            context.commit('member_search/setStateOptions', result, { root: true });
            context.commit('setPartnerSearchStateOptions', result);
        })
            .catch(function () {
            // fail silently
        });
        context.commit('setActiveSearchType', 'partner');
        var config = context.getters.member_search_configuration_partner(discipline, context);
        context.commit('member_search/configure', config, { root: true });
    },
    /**
     * Remove a coach from a discipline
     */
    removeCoach: function (context, payload) {
        context.commit('removeDisciplineCoach', payload);
    },
    /**
     * Remove a level for a discipline
     */
    removeLevel: function (context, payload) {
        context.commit('removeLevel', payload);
    },
    /**
     * Remove a partner from a discipline
     */
    removePartner: function (context, payload) {
        context.commit('removeDisciplinePartner', payload);
    },
    /**
     * Remove a skate test for the series application
     *
     * Must resolve with updated skate test history for use in skate test history state module
     */
    removeSkateTest: function (context, payload) {
        return new Promise(function (resolve, reject) {
            _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].removeSkateTest(payload)
                .then(function (response) {
                context.commit('updateUserDisciplineLevelEligibility', response.user_discipline_eligibility_update);
                context.dispatch('handleEligibilityChange');
                resolve(response.skate_test_history);
            })
                .catch(function (error_message) {
                reject(error_message);
            });
        });
    },
    /**
     * Save a new skate test for the series application
     *
     * Must resolve with updated skate test history for use in skate test history state module
     */
    saveSkateTest: function (context, payload) {
        var test_data = payload.test_data, active_discipline = payload.active_discipline;
        return new Promise(function (resolve, reject) {
            _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].saveSkateTest(test_data, active_discipline.key)
                .then(function (response) {
                context.commit('updateUserDisciplineLevelEligibility', response.user_discipline_eligibility_update);
                context.dispatch('handleEligibilityChange');
                resolve(response.skate_test_history);
            })
                .catch(function (error_message) {
                reject(error_message);
            });
        });
    },
    /**
     * Select a coach from member search results
     */
    selectCoach: function (context, payload) {
        context.commit('setDisciplineCoach', payload);
    },
    /**
     * Select a level for a discipline
     */
    selectLevel: function (context, payload) {
        context.commit('selectLevel', payload);
    },
    /**
     * Select a partner from member search results
     */
    selectPartner: function (context, payload) {
        return new Promise(function (resolve, reject) {
            if (payload.result.is_citizenship_ineligible) {
                context.commit('app/setNotice', {
                    notice: new _components_SeriesApplicationPartnerCitizenshipNotice_vue__WEBPACK_IMPORTED_MODULE_4__["default"]({
                        propsData: {
                            series: context.state.series
                        }
                    })
                }, { root: true });
                reject();
                return;
            }
            context.commit('setDisciplinePartner', payload);
            resolve();
        });
    },
    /**
     * Update the user's profile for the series application
     */
    updateProfile: function (context, payload) {
        return new Promise(function (resolve, reject) {
            _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].updateUserProfile(payload)
                .then(function () {
                context.commit('updateProfile', payload);
                resolve();
            })
                .catch(function (error) {
                reject(error);
            });
        });
    }
};
var getters = {
    /**
     * Payload for service when saving an application
     */
    application_save_payload: function (state) {
        var userApplication = state.user_application;
        if (userApplication) {
            return userApplication;
        }
        throw 'Unable to process application data.';
    },
    /**
     * Eligibility documents for the current series
     */
    eligibility_documents: function (state) {
        var series = state.series;
        return series ? series.application_configuration.eligibility_documents : [];
    },
    /**
     * The active application series
     */
    series: function (state) {
        return state.series;
    },
    /**
     * The maximum number of levels the user can select for a discipline
     */
    max_levels: function (state) {
        return state.series ? state.series.application_configuration.level_maximum : 2;
    },
    /**
     * Whether member search is active
     */
    member_search_active: function (state) {
        return state.active_search_type !== null;
    },
    /**
     * Get the active application
     */
    active_application: function (state) {
        return state.user_application;
    },
    /**
     * The total cost of the active series application
     */
    total_cost: function (state) {
        var result = 0;
        var disciplines = state.user_application ? state.user_application.disciplines : [];
        for (var i = 0; i < disciplines.length; i++) {
            var discipline = disciplines[i];
            for (var j = 0; j < discipline.levels.length; j++) {
                var level = discipline.levels[j];
                if (!level.is_paid) {
                    result = Math.round((result * 100) + (level.price * 100)) / 100;
                }
            }
        }
        return result;
    },
    /**
     * The list of levels that can be selected by a user.
     *
     * The user's eligible levels for a singles discipline, or the user/partner level combined eligibility
     */
    user_selectable_discipline_levels: function (state, getters) {
        return function (discipline) {
            var eligibility = getters.user_eligible_discipline_levels(discipline);
            if (discipline.partner_configuration.is_partnered) {
                var partner_eligibility = discipline.partners.length ? discipline.partners[0].eligible_levels : [];
                var partner_level_ids_1 = partner_eligibility.map(function (level) {
                    return level.id;
                });
                return eligibility.filter(function (level) {
                    return partner_level_ids_1.indexOf(level.id) !== -1;
                });
            }
            return eligibility;
        };
    },
    /**
     * Get the user-eligible levels for a discipline
     */
    user_eligible_discipline_levels: function (state) {
        return function (discipline) {
            var source = state.user_profile ? state.user_profile.series_level_eligibility : state.team_profile ? state.team_profile.series_level_eligibility : [];
            for (var i = 0; i < source.length; i++) {
                var userLevelEligibilityElement = source[i];
                if (userLevelEligibilityElement.discipline_id === discipline.id) {
                    return userLevelEligibilityElement.eligible_levels;
                }
            }
            return [];
        };
    },
    /**
     * Get the active application user profile
     */
    user_profile: function (state) {
        return state.user_profile;
    },
    /**
     * Factory getter to return member search partner configuration
     */
    member_search_configuration_partner: function (state, getters) {
        return function (discipline, context) {
            var result_validators = [_components_MemberSearch_MemberSearchValidators__WEBPACK_IMPORTED_MODULE_2__["validateResultActive"]];
            if (discipline.partner_configuration.partner_rules.indexOf('opposite_gender') !== -1) {
                result_validators.push(_components_MemberSearch_MemberSearchValidationFunctionFactory__WEBPACK_IMPORTED_MODULE_3__["MemberSearchValidationFunctionFactory"].opposite_gender(state.user_profile ? state.user_profile.gender : null));
            }
            if (discipline.partner_configuration.partner_rules.indexOf('compatible_levels') !== -1) {
                result_validators.push(_components_MemberSearch_MemberSearchValidationFunctionFactory__WEBPACK_IMPORTED_MODULE_3__["MemberSearchValidationFunctionFactory"].compatible_levels(getters.user_eligible_discipline_levels(discipline)));
            }
            return {
                // eslint-disable-next-line jsdoc/require-jsdoc
                search_function: function (search_params) {
                    return _services_SeriesApplicationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPIService"].partnerSearch(search_params, discipline.id);
                },
                selection_method: function (result) {
                    return context.dispatch('selectPartner', {
                        result: result,
                        discipline: discipline
                    });
                },
                close_method: function () {
                    context.dispatch('closeSearch');
                },
                ineligible_instruction: 'Please choose another partner.',
                entity_descriptor: 'Partner',
                result_validators: result_validators
            };
        };
    },
    /**
     * Whether a paid level exists on the active user application
     */
    paid_level_exists: function (state) {
        if (state.user_application) {
            for (var i = 0; i < state.user_application.disciplines.length; i++) {
                var discipline = state.user_application.disciplines[i];
                for (var j = 0; j < discipline.levels.length; j++) {
                    var level = discipline.levels[j];
                    if (level.is_paid) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    /**
     * Whether the current user is blocked from registering for the series due to their citizenship status
     */
    user_citizenship_ineligible: function (state) {
        return !!state.user_profile && state.user_profile.is_series_citizenship_ineligible;
    }
};
var mutations = {
    /**
     * Remove a coach from a discipline in state
     */
    removeDisciplineCoach: function (state, payload) {
        var userApplication = state.user_application;
        if (userApplication) {
            var discipline_ids = userApplication.disciplines.map(function (discipline) {
                return discipline.id;
            });
            var discipline_index = discipline_ids.indexOf(payload.discipline.id);
            var discipline = userApplication.disciplines[discipline_index];
            var coach_ids = discipline.coaches.map(function (coach) {
                return coach.id;
            });
            var coach_index = coach_ids.indexOf(payload.coach.id);
            if (coach_index !== -1) {
                discipline.coaches.splice(coach_index, 1);
            }
        }
    },
    /**
     * Remove a partner from a discipline in state
     *
     * Also removes subsequent elements in discipline (levels and coaches)
     */
    removeDisciplinePartner: function (state, payload) {
        var userApplication = state.user_application;
        if (userApplication) {
            var discipline_ids = userApplication.disciplines.map(function (discipline) {
                return discipline.id;
            });
            var discipline_index = discipline_ids.indexOf(payload.discipline.id);
            var discipline = userApplication.disciplines[discipline_index];
            var partner_ids = discipline.partners.map(function (partner) {
                return partner.id;
            });
            var partner_index = partner_ids.indexOf(payload.partner.id);
            if (partner_index !== -1) {
                discipline.partners.splice(partner_index, 1);
            }
            discipline.levels = [];
            discipline.coaches = [];
        }
    },
    /**
     * Remove a level from a discipline
     *
     * If removal results in no levels for discipline, remove all coaches as well
     */
    removeLevel: function (state, payload) {
        var userApplication = state.user_application;
        if (userApplication) {
            for (var i = 0; i < userApplication.disciplines.length; i++) {
                var discipline = userApplication.disciplines[i];
                if (discipline.id === payload.discipline.id) {
                    var level_ids = discipline.levels.map(function (level) {
                        return level.id;
                    });
                    var level_index = level_ids.indexOf(payload.level.id);
                    if (level_index !== -1) {
                        discipline.levels.splice(level_index, 1);
                    }
                    if (discipline.levels.length === 0) {
                        discipline.coaches = [];
                    }
                    return;
                }
            }
        }
    },
    /**
     * The active search type, or null if search is not currently active
     */
    setActiveSearchType: function (state, payload) {
        state.active_search_type = payload;
    },
    /**
     * Set the applied teams in state
     */
    setAppliedTeams: function (state, payload) {
        state.applied_teams = payload;
    },
    /**
     * Set the state form options for coach search in state
     */
    setCoachSearchStateOptions: function (state, payload) {
        state.coach_search_state_options = payload;
    },
    setIsTeamSeries: function (state, payload) {
        state.is_team_series = payload;
    },
    /**
     * Set the state form options for partner search in state
     */
    setPartnerSearchStateOptions: function (state, payload) {
        state.partner_search_state_options = payload;
    },
    /**
     * Set a coach for a discipline in state
     */
    setDisciplineCoach: function (state, payload) {
        var userApplication = state.user_application;
        if (userApplication) {
            for (var i = 0; i < userApplication.disciplines.length; i++) {
                var discipline = userApplication.disciplines[i];
                if (discipline.id === payload.discipline.id) {
                    discipline.coaches.push(payload.result);
                }
            }
        }
    },
    /**
     * Set a partner for a discipline in state
     */
    setDisciplinePartner: function (state, payload) {
        var userApplication = state.user_application;
        if (userApplication) {
            for (var i = 0; i < userApplication.disciplines.length; i++) {
                var discipline = userApplication.disciplines[i];
                if (discipline.id === payload.discipline.id) {
                    discipline.partners.push(payload.result);
                }
            }
        }
    },
    /**
     * Select/Add a level to a discipline
     */
    selectLevel: function (state, payload) {
        var userApplication = state.user_application;
        if (userApplication) {
            for (var i = 0; i < userApplication.disciplines.length; i++) {
                var discipline = userApplication.disciplines[i];
                if (discipline.id === payload.discipline.id) {
                    discipline.levels.push(__assign({}, payload.level, { is_paid: false }));
                }
            }
        }
    },
    /**
     * Set whether a saved application exists in state
     */
    setSavedApplicationExists: function (state, payload) {
        state.saved_application_exists = payload;
    },
    /**
     * Set the application series in state
     */
    setSeries: function (state, payload) {
        state.series = payload;
    },
    /**
     * Set the active user application in state
     */
    setUserApplication: function (state, payload) {
        state.user_application = payload;
    },
    /**
     * Set the user application profile in state
     */
    setUserProfile: function (state, payload) {
        state.user_profile = payload;
    },
    setTeamProfile: function (state, payload) {
        state.team_profile = payload;
    },
    /**
     * Update the user discipline level eligibility for 0 or more disciplines
     */
    updateUserDisciplineLevelEligibility: function (state, payload) {
        var source = state.user_profile ? state.user_profile.series_level_eligibility : [];
        // eslint-disable-next-line arrow-parens,arrow-body-style
        var source_discipline_ids = source.map(function (item) { return item.discipline_id; });
        for (var i = 0; i < payload.length; i++) {
            var payloadElement = payload[i];
            var source_index = source_discipline_ids.indexOf(payloadElement.discipline_id);
            if (source_index !== -1) {
                source[source_index].eligible_levels = payloadElement.eligible_levels;
            }
        }
    },
    /**
     * Update the user series application profile in state
     */
    updateProfile: function (state, payload) {
        if (state.user_profile) {
            if (payload.email) {
                state.user_profile.email = payload.email;
            }
        }
    }
};
var SeriesApplicationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesApplication/_transformers/SeriesApplicationAPITransformer.ts":
/*!******************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesApplication/_transformers/SeriesApplicationAPITransformer.ts ***!
  \******************************************************************************************************/
/*! exports provided: SeriesApplicationAPITransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesApplicationAPITransformer", function() { return SeriesApplicationAPITransformer; });
/* harmony import */ var _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor */ "./src/js/adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor.ts");
/* harmony import */ var _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../_transformers/SeriesRegistrationAPITransformer */ "./src/js/SeriesRegistration/_transformers/SeriesRegistrationAPITransformer.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};


var SeriesApplicationAPITransformer = /** @class */ (function () {
    function SeriesApplicationAPITransformer() {
    }
    /**
     * Create the base application from API data.
     *
     * If saved application in data, use it for base
     *
     * If not, create a blank application
     */
    SeriesApplicationAPITransformer.transformApplication = function (data, configuration) {
        var application_disciplines = data ? data.disciplines : [];
        var application_discipline_indicies = application_disciplines.map(function (discipline_data) { return discipline_data.discipline_id; });
        return {
            disciplines: configuration.disciplines.map(function (configuration_data) {
                var application_discipline_index = application_discipline_indicies.indexOf(configuration_data.id);
                var application_discipline;
                if (application_discipline_index !== -1) {
                    application_discipline = application_disciplines[application_discipline_index];
                }
                return SeriesApplicationAPITransformer.transformApplicationDiscipline(configuration_data, application_discipline);
            })
        };
    };
    SeriesApplicationAPITransformer.transformApplicationDiscipline = function (configuration_data, data) {
        var coaches = [];
        var levels = [];
        var partners = [];
        if (data) {
            coaches = data.coaches ? data.coaches.map(function (coach_data) {
                return __assign({}, coach_data);
            }) : [];
            levels = data.levels.map(function (level_data) {
                return __assign({}, level_data);
            });
            partners = data.partner && data.partner.id ? [data.partner] : [];
        }
        return {
            id: configuration_data.id,
            name: configuration_data.name,
            coach_limit: configuration_data.coach_limit,
            partner_configuration: __assign({}, configuration_data.partner_configuration),
            coaches: coaches,
            levels: levels,
            partners: partners
        };
    };
    SeriesApplicationAPITransformer.transformSeriesRegistrationUserApplicationProfile = function (data) {
        return {
            full_name: data.full_name,
            email: data.email,
            member_number: data.member_number,
            birth_date: data.birth_date,
            home_club: data.home_club,
            region_name: data.region_name,
            section_name: data.section_name,
            gender: data.gender,
            series_level_eligibility: data.series_level_eligibility.slice(),
            skate_test_history: _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_0__["SkateTestHistoryAPIAdaptor"].adaptUserSkateTestHistoryDataToUserSkateTestHistory(data.skate_test_history),
            is_series_citizenship_ineligible: data.is_series_citizenship_ineligible
        };
    };
    SeriesApplicationAPITransformer.transformFetchSeriesRegistrationSeriesApplicationCommon = function (data) {
        var series = data.series, user_application = data.user_application;
        var application_configuration = this.transformApplicationConfiguration(series.application_configuration);
        return {
            series: {
                icon: series.icon,
                name: series.name,
                application_deadline_formatted: _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_1__["SeriesRegistrationAPITransformer"].transformApplicationDeadline(series.application_deadline_formatted),
                application_configuration: application_configuration,
                links: __assign({}, series.links),
                refund_email_address: series.refund_email_address
            },
            saved_application_exists: user_application !== null,
            user_application: SeriesApplicationAPITransformer.transformApplication(user_application, application_configuration),
            team_application_profile: null,
            user_application_profile: null
        };
    };
    SeriesApplicationAPITransformer.transformFetchSeriesRegistrationSeriesApplication = function (data) {
        return __assign({}, this.transformFetchSeriesRegistrationSeriesApplicationCommon(data), { is_team_series: false, user_application_profile: SeriesApplicationAPITransformer.transformSeriesRegistrationUserApplicationProfile(data.user_application_profile) });
    };
    SeriesApplicationAPITransformer.transformFetchSeriesRegistrationSeriesApplicationTeam = function (data) {
        return __assign({}, this.transformFetchSeriesRegistrationSeriesApplicationCommon(data), { is_team_series: true, team_application_profile: SeriesApplicationAPITransformer.transformSeriesRegistrationTeamApplicationProfile(data.user_application_profile) });
    };
    SeriesApplicationAPITransformer.transformSaveSeriesApplication = function (app_data) {
        return {
            disciplines: app_data.disciplines.map(function (discipline) {
                return {
                    discipline_id: discipline.id,
                    partner_id: discipline.partners.length ? discipline.partners[0].id : null,
                    level_ids: discipline.levels.map(function (level) { return level.id; }),
                    coach_ids: discipline.coaches.map(function (coach) { return coach.id; })
                };
            })
        };
    };
    SeriesApplicationAPITransformer.transformSaveSeriesApplicationTeam = function (app_data) {
        return {
            disciplines: app_data.disciplines.map(function (discipline) {
                return {
                    discipline_id: discipline.id,
                    level_ids: discipline.levels.map(function (level) { return level.id; })
                };
            })
        };
    };
    SeriesApplicationAPITransformer.transformApplicationConfiguration = function (data) {
        return {
            disciplines: data.disciplines.slice(),
            levels_information: data.levels_information,
            level_maximum: data.level_maximum,
            eligibility_documents: data.eligibility_documents.slice()
        };
    };
    SeriesApplicationAPITransformer.transformSeriesRegistrationTeamApplicationProfile = function (data) {
        return {
            name: data.name,
            member_number: data.member_number,
            level: data.level,
            home_club: data.home_club || null,
            region_name: data.region_name || null,
            section_name: data.section_name || null,
            series_level_eligibility: data.series_level_eligibility.slice()
        };
    };
    return SeriesApplicationAPITransformer;
}());



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue":
/*!******************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesOverviewApplicationDiscipline_vue_vue_type_template_id_0a3ff769___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesOverviewApplicationDiscipline.vue?vue&type=template&id=0a3ff769& */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=template&id=0a3ff769&");
/* harmony import */ var _SeriesOverviewApplicationDiscipline_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesOverviewApplicationDiscipline.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesOverviewApplicationDiscipline_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesOverviewApplicationDiscipline_vue_vue_type_template_id_0a3ff769___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesOverviewApplicationDiscipline_vue_vue_type_template_id_0a3ff769___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationDiscipline_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewApplicationDiscipline.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationDiscipline_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=template&id=0a3ff769&":
/*!*************************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=template&id=0a3ff769& ***!
  \*************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationDiscipline_vue_vue_type_template_id_0a3ff769___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewApplicationDiscipline.vue?vue&type=template&id=0a3ff769& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationDiscipline.vue?vue&type=template&id=0a3ff769&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationDiscipline_vue_vue_type_template_id_0a3ff769___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationDiscipline_vue_vue_type_template_id_0a3ff769___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue":
/*!************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesOverviewApplicationTeam_vue_vue_type_template_id_194786d4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesOverviewApplicationTeam.vue?vue&type=template&id=194786d4& */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=template&id=194786d4&");
/* harmony import */ var _SeriesOverviewApplicationTeam_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesOverviewApplicationTeam.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesOverviewApplicationTeam_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesOverviewApplicationTeam_vue_vue_type_template_id_194786d4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesOverviewApplicationTeam_vue_vue_type_template_id_194786d4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=script&lang=ts&":
/*!*************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=script&lang=ts& ***!
  \*************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationTeam_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewApplicationTeam.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationTeam_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=template&id=194786d4&":
/*!*******************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=template&id=194786d4& ***!
  \*******************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationTeam_vue_vue_type_template_id_194786d4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewApplicationTeam.vue?vue&type=template&id=194786d4& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewApplicationTeam.vue?vue&type=template&id=194786d4&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationTeam_vue_vue_type_template_id_194786d4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewApplicationTeam_vue_vue_type_template_id_194786d4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue":
/*!************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesOverviewCta_vue_vue_type_template_id_fad9da4e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesOverviewCta.vue?vue&type=template&id=fad9da4e& */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=template&id=fad9da4e&");
/* harmony import */ var _SeriesOverviewCta_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesOverviewCta.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesOverviewCta_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesOverviewCta_vue_vue_type_template_id_fad9da4e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesOverviewCta_vue_vue_type_template_id_fad9da4e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=script&lang=ts&":
/*!*************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=script&lang=ts& ***!
  \*************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewCta_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewCta.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewCta_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=template&id=fad9da4e&":
/*!*******************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=template&id=fad9da4e& ***!
  \*******************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewCta_vue_vue_type_template_id_fad9da4e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewCta.vue?vue&type=template&id=fad9da4e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewCta.vue?vue&type=template&id=fad9da4e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewCta_vue_vue_type_template_id_fad9da4e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewCta_vue_vue_type_template_id_fad9da4e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue":
/*!****************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesOverviewTeamCta_vue_vue_type_template_id_bb781588___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesOverviewTeamCta.vue?vue&type=template&id=bb781588& */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=template&id=bb781588&");
/* harmony import */ var _SeriesOverviewTeamCta_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesOverviewTeamCta.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesOverviewTeamCta_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesOverviewTeamCta_vue_vue_type_template_id_bb781588___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesOverviewTeamCta_vue_vue_type_template_id_bb781588___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewTeamCta_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewTeamCta.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewTeamCta_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=template&id=bb781588&":
/*!***********************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=template&id=bb781588& ***!
  \***********************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewTeamCta_vue_vue_type_template_id_bb781588___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewTeamCta.vue?vue&type=template&id=bb781588& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_components/SeriesOverviewTeamCta.vue?vue&type=template&id=bb781588&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewTeamCta_vue_vue_type_template_id_bb781588___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewTeamCta_vue_vue_type_template_id_bb781588___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue":
/*!********************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesOverviewPage_vue_vue_type_template_id_aedc6b48___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesOverviewPage.vue?vue&type=template&id=aedc6b48& */ "./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=template&id=aedc6b48&");
/* harmony import */ var _SeriesOverviewPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesOverviewPage.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesOverviewPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesOverviewPage_vue_vue_type_template_id_aedc6b48___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesOverviewPage_vue_vue_type_template_id_aedc6b48___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewPage.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=template&id=aedc6b48&":
/*!***************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=template&id=aedc6b48& ***!
  \***************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewPage_vue_vue_type_template_id_aedc6b48___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesOverviewPage.vue?vue&type=template&id=aedc6b48& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue?vue&type=template&id=aedc6b48&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewPage_vue_vue_type_template_id_aedc6b48___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesOverviewPage_vue_vue_type_template_id_aedc6b48___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesOverview/_transformers/SeriesOverviewAPITransformer.ts":
/*!************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesOverview/_transformers/SeriesOverviewAPITransformer.ts ***!
  \************************************************************************************************/
/*! exports provided: SeriesOverviewAPITransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesOverviewAPITransformer", function() { return SeriesOverviewAPITransformer; });
/* harmony import */ var _SeriesApplication_transformers_SeriesApplicationAPITransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../SeriesApplication/_transformers/SeriesApplicationAPITransformer */ "./src/js/SeriesRegistration/SeriesApplication/_transformers/SeriesApplicationAPITransformer.ts");
/* harmony import */ var _adaptors_APIAdaptors_AppAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../adaptors/APIAdaptors/AppAPIAdaptor */ "./src/js/adaptors/APIAdaptors/AppAPIAdaptor.ts");
/* harmony import */ var _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_transformers/SeriesRegistrationAPITransformer */ "./src/js/SeriesRegistration/_transformers/SeriesRegistrationAPITransformer.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};



var SeriesOverviewAPITransformer = /** @class */ (function () {
    function SeriesOverviewAPITransformer() {
    }
    SeriesOverviewAPITransformer.transformFetchSeriesRegistrationSeriesOverview = function (data) {
        var series = data.series, user_application = data.user_application;
        var series_transformation = this.transformSeries(series);
        if (series.is_team_series) {
            return {
                series: this.transformSeries(series),
                user_application: null,
                applied_teams: this.transformAppliedTeams(data.applied_teams)
            };
        }
        return {
            series: this.transformSeries(series),
            user_application: this.transformApplication(user_application, series_transformation.application_configuration),
            applied_teams: null
        };
    };
    SeriesOverviewAPITransformer.transformSeries = function (series) {
        return {
            icon: series.icon,
            name: series.name,
            application_deadline_formatted: _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_2__["SeriesRegistrationAPITransformer"].transformApplicationDeadline(series.application_deadline_formatted),
            is_team_series: !!series.is_team_series,
            links: {
                application: series.links.application,
                checkout: series.links.checkout,
                standings: series.links.standings,
                series_list: series.links.series_list
            },
            application_configuration: _SeriesApplication_transformers_SeriesApplicationAPITransformer__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPITransformer"].transformApplicationConfiguration(series.application_configuration),
            status: {
                message: series.status.message ? _adaptors_APIAdaptors_AppAPIAdaptor__WEBPACK_IMPORTED_MODULE_1__["AppAPIAdaptor"].adaptStatusMessageData(series.status.message) : null,
                applications_open: series.status.applications_open,
                standings_available: series.status.standings_available
            },
            contact_email_address: series.contact_email_address,
            refund_email_address: series.refund_email_address,
            statement: series.statement,
            reports: series.reports ? series.reports.slice() : null,
            resource_documents: series.resource_documents.slice()
        };
    };
    /**
     * Use base application transformer, but strip out any disciplines the user hasn't applied for.
     */
    SeriesOverviewAPITransformer.transformApplication = function (user_application, application_configuration) {
        if (!user_application) {
            return null;
        }
        var base = _SeriesApplication_transformers_SeriesApplicationAPITransformer__WEBPACK_IMPORTED_MODULE_0__["SeriesApplicationAPITransformer"].transformApplication(user_application, application_configuration);
        return {
            disciplines: base.disciplines.filter(function (discipline) {
                if (discipline.partners.length) {
                    return true;
                }
                if (discipline.levels.length) {
                    return true;
                }
                if (discipline.coaches.length) {
                    return true;
                }
                return false;
            })
        };
    };
    SeriesOverviewAPITransformer.transformAppliedTeams = function (applied_teams_data) {
        if (applied_teams_data) {
            return {
                teams: applied_teams_data.teams.map(function (datum) {
                    return {
                        handbook: datum.handbook ? {
                            url: datum.handbook.url,
                            name: datum.handbook.name
                        } : null,
                        id: datum.id,
                        name: datum.name,
                        level: datum.level,
                        levels: datum.levels.map(function (level_datum) {
                            return __assign({}, level_datum);
                        })
                    };
                })
            };
        }
        return null;
    };
    return SeriesOverviewAPITransformer;
}());



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/SeriesStandingsConstants.ts":
/*!*******************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/SeriesStandingsConstants.ts ***!
  \*******************************************************************************/
/*! exports provided: SeriesStandingsConstants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesStandingsConstants", function() { return SeriesStandingsConstants; });
var SeriesStandingsConstants;
(function (SeriesStandingsConstants) {
    SeriesStandingsConstants.GRANULAR_FILTER_FIELD_OPTIONS = [
        {
            label: 'Skater Name',
            value: 'skater_name',
            type: 'text'
        },
        {
            label: 'Club Name',
            value: 'club_name',
            type: 'text'
        },
        {
            label: 'Competition Earned',
            value: 'competition_earned',
            type: 'text'
        },
        {
            label: 'National Ranking',
            value: 'national_rank',
            type: 'number_range'
        }
    ];
})(SeriesStandingsConstants || (SeriesStandingsConstants = {}));


/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue":
/*!*****************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _StandingsGlobalFilter_vue_vue_type_template_id_5a1c2ea7___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StandingsGlobalFilter.vue?vue&type=template&id=5a1c2ea7& */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=template&id=5a1c2ea7&");
/* harmony import */ var _StandingsGlobalFilter_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StandingsGlobalFilter.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _StandingsGlobalFilter_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _StandingsGlobalFilter_vue_vue_type_template_id_5a1c2ea7___WEBPACK_IMPORTED_MODULE_0__["render"],
  _StandingsGlobalFilter_vue_vue_type_template_id_5a1c2ea7___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=script&lang=ts&":
/*!******************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGlobalFilter_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./StandingsGlobalFilter.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGlobalFilter_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=template&id=5a1c2ea7&":
/*!************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=template&id=5a1c2ea7& ***!
  \************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGlobalFilter_vue_vue_type_template_id_5a1c2ea7___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./StandingsGlobalFilter.vue?vue&type=template&id=5a1c2ea7& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGlobalFilter.vue?vue&type=template&id=5a1c2ea7&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGlobalFilter_vue_vue_type_template_id_5a1c2ea7___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGlobalFilter_vue_vue_type_template_id_5a1c2ea7___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue":
/*!*******************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _StandingsGranularFilter_vue_vue_type_template_id_946205b8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StandingsGranularFilter.vue?vue&type=template&id=946205b8& */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=template&id=946205b8&");
/* harmony import */ var _StandingsGranularFilter_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StandingsGranularFilter.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _StandingsGranularFilter_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _StandingsGranularFilter_vue_vue_type_template_id_946205b8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _StandingsGranularFilter_vue_vue_type_template_id_946205b8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGranularFilter_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./StandingsGranularFilter.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGranularFilter_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=template&id=946205b8&":
/*!**************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=template&id=946205b8& ***!
  \**************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGranularFilter_vue_vue_type_template_id_946205b8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./StandingsGranularFilter.vue?vue&type=template&id=946205b8& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsGranularFilter.vue?vue&type=template&id=946205b8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGranularFilter_vue_vue_type_template_id_946205b8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsGranularFilter_vue_vue_type_template_id_946205b8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue":
/*!**********************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _StandingsTable_vue_vue_type_template_id_c3c74d5c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StandingsTable.vue?vue&type=template&id=c3c74d5c& */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=template&id=c3c74d5c&");
/* harmony import */ var _StandingsTable_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StandingsTable.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _StandingsTable_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _StandingsTable_vue_vue_type_template_id_c3c74d5c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _StandingsTable_vue_vue_type_template_id_c3c74d5c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTable_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./StandingsTable.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTable_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=template&id=c3c74d5c&":
/*!*****************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=template&id=c3c74d5c& ***!
  \*****************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTable_vue_vue_type_template_id_c3c74d5c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./StandingsTable.vue?vue&type=template&id=c3c74d5c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTable.vue?vue&type=template&id=c3c74d5c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTable_vue_vue_type_template_id_c3c74d5c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTable_vue_vue_type_template_id_c3c74d5c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue":
/*!**************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _StandingsTableItem_vue_vue_type_template_id_ea0eebf6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StandingsTableItem.vue?vue&type=template&id=ea0eebf6& */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=template&id=ea0eebf6&");
/* harmony import */ var _StandingsTableItem_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StandingsTableItem.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _StandingsTableItem_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _StandingsTableItem_vue_vue_type_template_id_ea0eebf6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _StandingsTableItem_vue_vue_type_template_id_ea0eebf6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=script&lang=ts&":
/*!***************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=script&lang=ts& ***!
  \***************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTableItem_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./StandingsTableItem.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTableItem_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=template&id=ea0eebf6&":
/*!*********************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=template&id=ea0eebf6& ***!
  \*********************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTableItem_vue_vue_type_template_id_ea0eebf6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./StandingsTableItem.vue?vue&type=template&id=ea0eebf6& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_components/StandingsTableItem.vue?vue&type=template&id=ea0eebf6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTableItem_vue_vue_type_template_id_ea0eebf6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_StandingsTableItem_vue_vue_type_template_id_ea0eebf6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue":
/*!**********************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesStandingsPage_vue_vue_type_template_id_43797166___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesStandingsPage.vue?vue&type=template&id=43797166& */ "./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=template&id=43797166&");
/* harmony import */ var _SeriesStandingsPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesStandingsPage.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesStandingsPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesStandingsPage_vue_vue_type_template_id_43797166___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesStandingsPage_vue_vue_type_template_id_43797166___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesStandingsPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesStandingsPage.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesStandingsPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=template&id=43797166&":
/*!*****************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=template&id=43797166& ***!
  \*****************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesStandingsPage_vue_vue_type_template_id_43797166___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesStandingsPage.vue?vue&type=template&id=43797166& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue?vue&type=template&id=43797166&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesStandingsPage_vue_vue_type_template_id_43797166___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesStandingsPage_vue_vue_type_template_id_43797166___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_services/SeriesStandingsApiService.ts":
/*!******************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_services/SeriesStandingsApiService.ts ***!
  \******************************************************************************************/
/*! exports provided: SeriesStandingsApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesStandingsApiService", function() { return SeriesStandingsApiService; });
/* harmony import */ var _services_SeriesRegistrationAPIService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_services/SeriesRegistrationAPIService */ "./src/js/SeriesRegistration/_services/SeriesRegistrationAPIService.ts");
/* harmony import */ var _transformers_SeriesStandingsApiTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_transformers/SeriesStandingsApiTransformer */ "./src/js/SeriesRegistration/SeriesStandings/_transformers/SeriesStandingsApiTransformer.ts");
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


var SeriesStandingsApiService = /** @class */ (function (_super) {
    __extends(SeriesStandingsApiService, _super);
    function SeriesStandingsApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fetch the standings page information for a series
     */
    SeriesStandingsApiService.fetchSeriesStandings = function () {
        var series_id = this.getActiveSeriesId();
        var url = "/api/series-registration/" + series_id + "/standings";
        return this.fetchAndTransformResponse({
            url: url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data) {
                return _transformers_SeriesStandingsApiTransformer__WEBPACK_IMPORTED_MODULE_1__["SeriesStandingsApiTransformer"].transformFetchSeriesStandings(response_data);
            },
            // eslint-disable-next-line jsdoc/require-jsdoc
            validateResponse: function (response_data) {
                if (!response_data) {
                    console.error('Empty FetchSeriesStandingsApiResponse');
                    return false;
                }
                if (!response_data.series) {
                    console.error('Empty FetchSeriesStandingsApiResponse.series');
                    return false;
                }
                if (!response_data.standings) {
                    console.error('Empty FetchSeriesStandingsApiResponse.standings');
                    return false;
                }
                return true;
            }
        });
    };
    return SeriesStandingsApiService;
}(_services_SeriesRegistrationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesRegistrationAPIService"]));



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_services/StandingsFilterService.ts":
/*!***************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_services/StandingsFilterService.ts ***!
  \***************************************************************************************/
/*! exports provided: StandingsFilterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StandingsFilterService", function() { return StandingsFilterService; });
/* harmony import */ var _services_BaseFilterService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/BaseFilterService */ "./src/js/services/BaseFilterService.ts");
/* harmony import */ var _StandingsGranularFilterService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StandingsGranularFilterService */ "./src/js/SeriesRegistration/SeriesStandings/_services/StandingsGranularFilterService.ts");
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


var StandingsFilterService = /** @class */ (function (_super) {
    __extends(StandingsFilterService, _super);
    /**
     * Create a new filter instance
     */
    function StandingsFilterService(available_global_filters, active_global_filters, active_granular_filter) {
        var _this = _super.call(this) || this;
        _this.active_granular_filter = StandingsFilterService.parseGranularFilter(active_granular_filter);
        _this.section_filter = StandingsFilterService.parseSectionFilter(available_global_filters, active_global_filters);
        _this.discipline_filter = StandingsFilterService.parseGlobalStringFilter('disciplines', available_global_filters, active_global_filters);
        _this.level_filter = StandingsFilterService.parseGlobalStringFilter('levels', available_global_filters, active_global_filters);
        return _this;
    }
    /**
     * Parse the active granular filter.  Return null if filter is not complete enough to use for filtering
     */
    StandingsFilterService.parseGranularFilter = function (granular_filter) {
        var field = granular_filter.field;
        if (field === null) {
            return null;
        }
        if (granular_filter.term[0] === null && granular_filter.term[1] === null) {
            return null;
        }
        return {
            field: field,
            term: granular_filter.term
        };
    };
    /**
     * Parse the section filter.
     *
     * Return null if selected section filters match available
     */
    StandingsFilterService.parseSectionFilter = function (available_global_filters, active_global_filters) {
        if (available_global_filters.sections.length === active_global_filters.sections.length) {
            return null;
        }
        return active_global_filters.sections.map(function (filter) {
            return filter.value;
        });
    };
    /**
     * Parse a global string filter
     *
     * Return null if selected section filters match available
     */
    StandingsFilterService.parseGlobalStringFilter = function (filter_key, available_global_filters, active_global_filters) {
        if (available_global_filters[filter_key].length === active_global_filters[filter_key].length) {
            return null;
        }
        return active_global_filters[filter_key].map(function (filter) {
            return filter.value;
        });
    };
    /**
     * Perform the global filtering of standings
     */
    StandingsFilterService.prototype.filter = function (events) {
        var _this = this;
        if (this.filteringInactive()) {
            return events;
        }
        return events.reduce(function (carry, event) {
            if (_this.eventPassesGlobalFilters(event)) {
                var event_standings = _this.filterEventStandings(event.standings);
                if (event_standings.length) {
                    carry.push(__assign({}, event, { standings: event_standings }));
                }
            }
            return carry;
        }, []);
    };
    /**
     * Filter standings rows within an event
     */
    StandingsFilterService.prototype.filterEventStandings = function (standings) {
        var _this = this;
        return standings.filter(function (standing_row) {
            if (_this.active_granular_filter) {
                var method_map = _StandingsGranularFilterService__WEBPACK_IMPORTED_MODULE_1__["StandingsGranularFilterService"].METHOD_MAP;
                if (!method_map[_this.active_granular_filter.field.value](standing_row, _this.active_granular_filter.term)) {
                    return false;
                }
            }
            if (_this.section_filter) {
                if (!_StandingsGranularFilterService__WEBPACK_IMPORTED_MODULE_1__["StandingsGranularFilterService"].rowPassesSectionFilter(standing_row, _this.section_filter)) {
                    return false;
                }
            }
            return true;
        });
    };
    /**
     * Whether current filter set results in filtering being inactive
     */
    StandingsFilterService.prototype.filteringInactive = function () {
        return !this.discipline_filter && !this.level_filter && !this.active_granular_filter && !this.section_filter;
    };
    /**
     *  Whether an event passes the active event filters
     */
    StandingsFilterService.prototype.eventPassesGlobalFilters = function (event) {
        if (this.discipline_filter && this.discipline_filter.indexOf(event.discipline_name) === -1) {
            return false;
        }
        if (this.level_filter && this.level_filter.indexOf(event.level_name) === -1) {
            return false;
        }
        return true;
    };
    return StandingsFilterService;
}(_services_BaseFilterService__WEBPACK_IMPORTED_MODULE_0__["BaseFilterService"]));



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_services/StandingsGranularFilterService.ts":
/*!***********************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_services/StandingsGranularFilterService.ts ***!
  \***********************************************************************************************/
/*! exports provided: StandingsGranularFilterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StandingsGranularFilterService", function() { return StandingsGranularFilterService; });
/* harmony import */ var _services_BaseFilterService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/BaseFilterService */ "./src/js/services/BaseFilterService.ts");
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

var StandingsGranularFilterService = /** @class */ (function (_super) {
    __extends(StandingsGranularFilterService, _super);
    function StandingsGranularFilterService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Whether a standings row passes a participant name filter
     */
    StandingsGranularFilterService.rowPassesParticipantNameFilter = function (standing_row, filter_term) {
        var term = filter_term[0];
        if (term) {
            return StandingsGranularFilterService.valuePassesStringFilter(standing_row.participant_name, term);
        }
        return true;
    };
    /**
     * Whether a standings row passes a club name filter
     */
    StandingsGranularFilterService.rowPassesClubNameFilter = function (standing_row, filter_term) {
        var term = filter_term[0];
        if (term) {
            return StandingsGranularFilterService.valuePassesStringFilter(standing_row.home_club, term);
        }
        return true;
    };
    /**
     * Whether a standings row passes a competition earned filter
     */
    StandingsGranularFilterService.rowCompetitionEarnedFilter = function (standing_row, filter_term) {
        var term = filter_term[0];
        if (term) {
            if (standing_row.competition_earned) {
                return StandingsGranularFilterService.valuePassesStringFilter(standing_row.competition_earned, term);
            }
            return false;
        }
        return true;
    };
    /**
     * Whether a standings row passes a national ranking filter
     */
    StandingsGranularFilterService.rowPassesNationalRankingFilter = function (standing_row, filter_term) {
        var min_parsed = parseInt(String(filter_term[0]));
        var max_parsed = parseInt(String(filter_term[1]));
        var row_rank = parseInt(String(standing_row.national_rank));
        if (min_parsed && (row_rank && row_rank < min_parsed)) {
            return false;
        }
        if (max_parsed && (!row_rank || row_rank > max_parsed)) {
            return false;
        }
        return true;
    };
    /**
     * Whether a standings row passes a section key filter
     */
    StandingsGranularFilterService.rowPassesSectionFilter = function (standing_row, filter_section_keys) {
        return filter_section_keys.indexOf(standing_row.section_key) !== -1;
    };
    StandingsGranularFilterService.METHOD_MAP = {
        skater_name: StandingsGranularFilterService.rowPassesParticipantNameFilter,
        club_name: StandingsGranularFilterService.rowPassesClubNameFilter,
        competition_earned: StandingsGranularFilterService.rowCompetitionEarnedFilter,
        national_rank: StandingsGranularFilterService.rowPassesNationalRankingFilter
    };
    return StandingsGranularFilterService;
}(_services_BaseFilterService__WEBPACK_IMPORTED_MODULE_0__["BaseFilterService"]));



/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_store/SeriesStandingsState.ts":
/*!**********************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_store/SeriesStandingsState.ts ***!
  \**********************************************************************************/
/*! exports provided: State, SeriesStandingsState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesStandingsState", function() { return SeriesStandingsState; });
/* harmony import */ var _services_SeriesStandingsApiService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/SeriesStandingsApiService */ "./src/js/SeriesRegistration/SeriesStandings/_services/SeriesStandingsApiService.ts");
/* harmony import */ var _services_StandingsFilterService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/StandingsFilterService */ "./src/js/SeriesRegistration/SeriesStandings/_services/StandingsFilterService.ts");
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
        /**
         * The available set of global filters
         */
        this.available_global_filters = {
            sections: [],
            disciplines: [],
            levels: []
        };
        /**
         * The active set of global filters
         */
        this.active_global_filters = {
            sections: [],
            disciplines: [],
            levels: []
        };
        /**
         * The active granular filter
         */
        this.active_granular_filter = {
            term: [null, null],
            field: null
        };
        /**
         * The active series
         */
        this.series = null;
        /**
         * The active standing
         */
        this.standings = null;
    }
    return State;
}());

var actions = {
    /**
     * Fetch series standings data
     */
    fetchSeriesStandings: function (_a) {
        var commit = _a.commit;
        return new Promise(function (resolve, reject) {
            _services_SeriesStandingsApiService__WEBPACK_IMPORTED_MODULE_0__["SeriesStandingsApiService"].fetchSeriesStandings()
                .then(function (response) {
                commit('setSeries', response.series);
                commit('setStandings', response.standings);
                commit('setAvailableGlobalFilters', response.filters);
                commit('setActiveGlobalFilters', response.filters);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    }
};
var getters = {
    /**
     * List of standings events to display on standings page
     *
     * Events and standings filtered through active filters
     */
    display_events: function (state) {
        if (!state.standings) {
            return [];
        }
        var filter = new _services_StandingsFilterService__WEBPACK_IMPORTED_MODULE_1__["StandingsFilterService"](state.available_global_filters, state.active_global_filters, state.active_granular_filter);
        return filter.filter(state.standings.events);
    },
    /**
     * Formatted string indicating when standings were last updated
     */
    standings_last_updated: function (state) {
        return state.standings ? state.standings.meta.last_updated_datetime_formatted : null;
    }
};
var mutations = {
    /**
     * Set active global filters
     */
    setActiveGlobalFilters: function (state, payload) {
        state.active_global_filters = __assign({}, payload);
    },
    /**
     * Set the available global filters in state
     */
    setAvailableGlobalFilters: function (state, payload) {
        state.available_global_filters = __assign({}, payload);
    },
    /**
     * Set the series in state
     */
    setSeries: function (state, payload) {
        state.series = payload;
    },
    /**
     * Set standings in state
     */
    setStandings: function (state, payload) {
        state.standings = payload;
    },
    /**
     * Update the granular filter
     */
    updateGranularFilter: function (state, payload) {
        state.active_granular_filter = __assign({}, payload);
    }
};
var SeriesStandingsState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/SeriesRegistration/SeriesStandings/_transformers/SeriesStandingsApiTransformer.ts":
/*!**************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/SeriesStandings/_transformers/SeriesStandingsApiTransformer.ts ***!
  \**************************************************************************************************/
/*! exports provided: SeriesStandingsApiTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesStandingsApiTransformer", function() { return SeriesStandingsApiTransformer; });
/* harmony import */ var _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_transformers/SeriesRegistrationAPITransformer */ "./src/js/SeriesRegistration/_transformers/SeriesRegistrationAPITransformer.ts");
/* harmony import */ var _helpers_StringHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../helpers/StringHelpers */ "./src/js/helpers/StringHelpers.ts");


var SeriesStandingsApiTransformer = /** @class */ (function () {
    function SeriesStandingsApiTransformer(data) {
        this.data = data;
    }
    SeriesStandingsApiTransformer.transformFetchSeriesStandings = function (data) {
        var series = data.series, standings = data.standings;
        return {
            series: {
                name: series.name,
                icon: series.icon,
                application_deadline_formatted: _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_0__["SeriesRegistrationAPITransformer"].transformApplicationDeadline(series.application_deadline_formatted),
                links: {
                    overview: series.links.overview
                },
                resource_documents: series.resource_documents
            },
            standings: {
                meta: {
                    last_updated_datetime_formatted: standings.meta.last_updated_datetime_formatted
                },
                events: standings.events.map(function (event) {
                    return SeriesStandingsApiTransformer.transformStandingsEvent(event);
                })
            },
            filters: {
                sections: standings.meta.available_filters.section_keys
                    .map(function (section_key) {
                    return {
                        label: _helpers_StringHelpers__WEBPACK_IMPORTED_MODULE_1__["StringHelpers"].titleCase(section_key),
                        value: section_key
                    };
                }),
                disciplines: standings.meta.available_filters.discipline_names
                    .map(function (discipline) {
                    return {
                        label: _helpers_StringHelpers__WEBPACK_IMPORTED_MODULE_1__["StringHelpers"].titleCase(discipline),
                        value: discipline
                    };
                }),
                levels: standings.meta.available_filters.level_names
                    .map(function (level) {
                    return {
                        label: _helpers_StringHelpers__WEBPACK_IMPORTED_MODULE_1__["StringHelpers"].titleCase(level),
                        value: level
                    };
                })
            }
        };
    };
    SeriesStandingsApiTransformer.transformStandingsEvent = function (event) {
        return {
            uid: SeriesStandingsApiTransformer.uid++,
            name: event.name,
            discipline_name: event.discipline_name,
            level_name: event.level_name,
            standings: SeriesStandingsApiTransformer.transformStandingsEventStandings(event.standings)
        };
    };
    SeriesStandingsApiTransformer.transformStandingsEventStandings = function (standings) {
        return standings.map(function (standing_data) {
            return standing_data;
        });
    };
    SeriesStandingsApiTransformer.uid = 1;
    return SeriesStandingsApiTransformer;
}());



/***/ }),

/***/ "./src/js/SeriesRegistration/_components/SeriesPageHeader.vue":
/*!********************************************************************!*\
  !*** ./src/js/SeriesRegistration/_components/SeriesPageHeader.vue ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesPageHeader_vue_vue_type_template_id_39b73a9f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesPageHeader.vue?vue&type=template&id=39b73a9f& */ "./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=template&id=39b73a9f&");
/* harmony import */ var _SeriesPageHeader_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesPageHeader.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesPageHeader_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesPageHeader_vue_vue_type_template_id_39b73a9f___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesPageHeader_vue_vue_type_template_id_39b73a9f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/_components/SeriesPageHeader.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesPageHeader_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesPageHeader.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesPageHeader_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=template&id=39b73a9f&":
/*!***************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=template&id=39b73a9f& ***!
  \***************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesPageHeader_vue_vue_type_template_id_39b73a9f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesPageHeader.vue?vue&type=template&id=39b73a9f& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_components/SeriesPageHeader.vue?vue&type=template&id=39b73a9f&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesPageHeader_vue_vue_type_template_id_39b73a9f___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesPageHeader_vue_vue_type_template_id_39b73a9f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue":
/*!*********************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesRegistrationEligibilityConfirmation_vue_vue_type_template_id_1d495854___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesRegistrationEligibilityConfirmation.vue?vue&type=template&id=1d495854& */ "./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=template&id=1d495854&");
/* harmony import */ var _SeriesRegistrationEligibilityConfirmation_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesRegistrationEligibilityConfirmation.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesRegistrationEligibilityConfirmation_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesRegistrationEligibilityConfirmation_vue_vue_type_template_id_1d495854___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesRegistrationEligibilityConfirmation_vue_vue_type_template_id_1d495854___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationEligibilityConfirmation_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesRegistrationEligibilityConfirmation.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationEligibilityConfirmation_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=template&id=1d495854&":
/*!****************************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=template&id=1d495854& ***!
  \****************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationEligibilityConfirmation_vue_vue_type_template_id_1d495854___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesRegistrationEligibilityConfirmation.vue?vue&type=template&id=1d495854& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue?vue&type=template&id=1d495854&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationEligibilityConfirmation_vue_vue_type_template_id_1d495854___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationEligibilityConfirmation_vue_vue_type_template_id_1d495854___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/_models/SeriesManagedTeam.ts":
/*!****************************************************************!*\
  !*** ./src/js/SeriesRegistration/_models/SeriesManagedTeam.ts ***!
  \****************************************************************/
/*! exports provided: SeriesManagedTeam */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesManagedTeam", function() { return SeriesManagedTeam; });
/* harmony import */ var _Teams_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Teams/_models */ "./src/js/Teams/_models/index.ts");
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

var SeriesManagedTeam = /** @class */ (function (_super) {
    __extends(SeriesManagedTeam, _super);
    function SeriesManagedTeam(params) {
        var _this = _super.call(this, params) || this;
        _this.select_button = params.select_button;
        return _this;
    }
    return SeriesManagedTeam;
}(_Teams_models__WEBPACK_IMPORTED_MODULE_0__["ManagedTeam"]));



/***/ }),

/***/ "./src/js/SeriesRegistration/_models/index.ts":
/*!****************************************************!*\
  !*** ./src/js/SeriesRegistration/_models/index.ts ***!
  \****************************************************/
/*! exports provided: SeriesManagedTeam */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesManagedTeam__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesManagedTeam */ "./src/js/SeriesRegistration/_models/SeriesManagedTeam.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SeriesManagedTeam", function() { return _SeriesManagedTeam__WEBPACK_IMPORTED_MODULE_0__["SeriesManagedTeam"]; });




/***/ }),

/***/ "./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue":
/*!**************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesRegistrationIndexPage_vue_vue_type_template_id_645ae98e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesRegistrationIndexPage.vue?vue&type=template&id=645ae98e& */ "./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=template&id=645ae98e&");
/* harmony import */ var _SeriesRegistrationIndexPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesRegistrationIndexPage.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesRegistrationIndexPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesRegistrationIndexPage_vue_vue_type_template_id_645ae98e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesRegistrationIndexPage_vue_vue_type_template_id_645ae98e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=script&lang=ts&":
/*!***************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=script&lang=ts& ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationIndexPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesRegistrationIndexPage.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationIndexPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=template&id=645ae98e&":
/*!*********************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=template&id=645ae98e& ***!
  \*********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationIndexPage_vue_vue_type_template_id_645ae98e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesRegistrationIndexPage.vue?vue&type=template&id=645ae98e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue?vue&type=template&id=645ae98e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationIndexPage_vue_vue_type_template_id_645ae98e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationIndexPage_vue_vue_type_template_id_645ae98e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue":
/*!*******************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesRegistrationSelectTeamPage_vue_vue_type_template_id_195e07a0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesRegistrationSelectTeamPage.vue?vue&type=template&id=195e07a0& */ "./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=template&id=195e07a0&");
/* harmony import */ var _SeriesRegistrationSelectTeamPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeriesRegistrationSelectTeamPage.vue?vue&type=script&lang=ts& */ "./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeriesRegistrationSelectTeamPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeriesRegistrationSelectTeamPage_vue_vue_type_template_id_195e07a0___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SeriesRegistrationSelectTeamPage_vue_vue_type_template_id_195e07a0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationSelectTeamPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesRegistrationSelectTeamPage.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationSelectTeamPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=template&id=195e07a0&":
/*!**************************************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=template&id=195e07a0& ***!
  \**************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationSelectTeamPage_vue_vue_type_template_id_195e07a0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SeriesRegistrationSelectTeamPage.vue?vue&type=template&id=195e07a0& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue?vue&type=template&id=195e07a0&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationSelectTeamPage_vue_vue_type_template_id_195e07a0___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeriesRegistrationSelectTeamPage_vue_vue_type_template_id_195e07a0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/SeriesRegistration/_services/SeriesRegistrationAPIService.ts":
/*!*****************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_services/SeriesRegistrationAPIService.ts ***!
  \*****************************************************************************/
/*! exports provided: SeriesRegistrationAPIService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesRegistrationAPIService", function() { return SeriesRegistrationAPIService; });
/* harmony import */ var _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/AbstractAPIService */ "./src/js/services/AbstractAPIService.ts");
/* harmony import */ var _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_transformers/SeriesRegistrationAPITransformer */ "./src/js/SeriesRegistration/_transformers/SeriesRegistrationAPITransformer.ts");
/* harmony import */ var _config_AppConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/AppConfig */ "./src/js/config/AppConfig.ts");
/* harmony import */ var _SeriesOverview_transformers_SeriesOverviewAPITransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../SeriesOverview/_transformers/SeriesOverviewAPITransformer */ "./src/js/SeriesRegistration/SeriesOverview/_transformers/SeriesOverviewAPITransformer.ts");
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




var SeriesRegistrationAPIService = /** @class */ (function (_super) {
    __extends(SeriesRegistrationAPIService, _super);
    function SeriesRegistrationAPIService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fetch the index series list
     */
    SeriesRegistrationAPIService.fetchSeriesList = function () {
        return this.fetchAndTransformResponse({
            url: '/api/series-registration/series',
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data) {
                return _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_1__["SeriesRegistrationAPITransformer"].transformFetchSeriesRegistrationSeriesList(response_data);
            }
        });
    };
    /**
     * Fetch data for a series overview
     */
    SeriesRegistrationAPIService.fetchSeriesOverview = function () {
        var series_id = SeriesRegistrationAPIService.getActiveSeriesId();
        return this.fetchAndTransformResponse({
            url: "/api/series-registration/" + series_id + "/overview",
            /**
             * Transform API data into App data
             */
            transformResponse: function (response_data) {
                return _SeriesOverview_transformers_SeriesOverviewAPITransformer__WEBPACK_IMPORTED_MODULE_3__["SeriesOverviewAPITransformer"].transformFetchSeriesRegistrationSeriesOverview(response_data);
            }
        });
    };
    /**
     * Get the active Series ID from a cookie value
     */
    SeriesRegistrationAPIService.getActiveSeriesId = function () {
        var series_id = '';
        if (_config_AppConfig__WEBPACK_IMPORTED_MODULE_2__["SERIES_REGISTRATION_COOKIE_NAME"]) {
            var pattern = "(?:(?:^|.*;\\s*)" + _config_AppConfig__WEBPACK_IMPORTED_MODULE_2__["SERIES_REGISTRATION_COOKIE_NAME"] + "\\s*\\=\\s*([^;]*).*$)|^.*$";
            var cookieValue = document.cookie.replace(new RegExp(pattern), '$1');
            series_id = cookieValue.trim();
            if (series_id !== '') {
                return series_id;
            }
        }
        console.warn('Unable to determine active series ID');
        throw 'Unable to determine active series ID';
    };
    SeriesRegistrationAPIService.getActiveTeamId = function (suppress_errors) {
        if (suppress_errors === void 0) { suppress_errors = true; }
        if (suppress_errors) {
            try {
                return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].getValueFromCookie(_config_AppConfig__WEBPACK_IMPORTED_MODULE_2__["SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME"], 'active team id', true);
            }
            catch (e) {
                return null;
            }
        }
        return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].getValueFromCookie(_config_AppConfig__WEBPACK_IMPORTED_MODULE_2__["SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME"], 'active team id', false);
    };
    SeriesRegistrationAPIService.fetchSeriesTeamSelect = function () {
        var series_id = SeriesRegistrationAPIService.getActiveSeriesId();
        return this.fetchAndTransformResponse({
            url: "/api/series-registration/" + series_id + "/managed-teams",
            /**
             * Transform API data into App data
             */
            transformResponse: function (response_data) {
                return _transformers_SeriesRegistrationAPITransformer__WEBPACK_IMPORTED_MODULE_1__["SeriesRegistrationAPITransformer"].transformFetchSeriesSelectTeam(response_data);
            }
        });
    };
    return SeriesRegistrationAPIService;
}(_services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"]));



/***/ }),

/***/ "./src/js/SeriesRegistration/_store/SeriesRegistrationState.ts":
/*!*********************************************************************!*\
  !*** ./src/js/SeriesRegistration/_store/SeriesRegistrationState.ts ***!
  \*********************************************************************/
/*! exports provided: State, SeriesRegistrationState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesRegistrationState", function() { return SeriesRegistrationState; });
/* harmony import */ var _services_SeriesRegistrationAPIService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/SeriesRegistrationAPIService */ "./src/js/SeriesRegistration/_services/SeriesRegistrationAPIService.ts");
/* harmony import */ var _SeriesApplication_store_SeriesApplicationState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../SeriesApplication/_store/SeriesApplicationState */ "./src/js/SeriesRegistration/SeriesApplication/_store/SeriesApplicationState.ts");


var State = /** @class */ (function () {
    function State() {
        this.series_list = [];
        this.overview_series = null;
        this.series_summary = null;
        this.selectable_teams = [];
    }
    return State;
}());

var actions = {
    /**
     * Fetch the series index list
     */
    fetchSeriesList: function (context) {
        return new Promise(function (resolve, reject) {
            _services_SeriesRegistrationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesRegistrationAPIService"].fetchSeriesList()
                .then(function (result) {
                context.commit('setSeriesList', result.series);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch the series overview series
     */
    fetchSeriesOverview: function (context) {
        return new Promise(function (resolve, reject) {
            _services_SeriesRegistrationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesRegistrationAPIService"].fetchSeriesOverview()
                .then(function (result) {
                context.commit('setSeriesOverview', result.series);
                if (result.user_application) {
                    context.commit('application/setUserApplication', result.user_application);
                }
                if (result.applied_teams) {
                    context.commit('application/setAppliedTeams', result.applied_teams);
                }
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch the series overview series
     */
    fetchSeriesTeamSelect: function (context) {
        return new Promise(function (resolve, reject) {
            _services_SeriesRegistrationAPIService__WEBPACK_IMPORTED_MODULE_0__["SeriesRegistrationAPIService"].fetchSeriesTeamSelect()
                .then(function (result) {
                context.commit('setSeriesSummary', result.series);
                context.commit('setSelectableTeams', result.teams);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    }
};
var getters = {
    /**
     * Get a discipline resource document from a discipline id
     */
    overview_discipline_document: function (state) {
        return function (discipline_id) {
            if (state.overview_series) {
                for (var i = 0; i < state.overview_series.resource_documents.length; i++) {
                    var document = state.overview_series.resource_documents[i];
                    if (document.discipline_id === discipline_id) {
                        return document;
                    }
                }
            }
            return null;
        };
    }
};
var mutations = {
    /**
     * Set the selectable teams in state
     */
    setSelectableTeams: function (state, payload) {
        state.selectable_teams = payload;
    },
    /**
     * Set the series list in state
     */
    setSeriesList: function (state, payload) {
        state.series_list = payload;
    },
    /**
     * Set the overview series in state
     */
    setSeriesOverview: function (state, payload) {
        state.overview_series = payload;
    },
    /**
     * Set series summary in state
     */
    setSeriesSummary: function (state, payload) {
        state.series_summary = payload;
    }
};
var SeriesRegistrationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations,
    modules: {
        'application': _SeriesApplication_store_SeriesApplicationState__WEBPACK_IMPORTED_MODULE_1__["SeriesApplicationState"]
    }
};


/***/ }),

/***/ "./src/js/SeriesRegistration/_transformers/SeriesRegistrationAPITransformer.ts":
/*!*************************************************************************************!*\
  !*** ./src/js/SeriesRegistration/_transformers/SeriesRegistrationAPITransformer.ts ***!
  \*************************************************************************************/
/*! exports provided: SeriesRegistrationAPITransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesRegistrationAPITransformer", function() { return SeriesRegistrationAPITransformer; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_models */ "./src/js/SeriesRegistration/_models/index.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var SeriesRegistrationAPITransformer = /** @class */ (function () {
    function SeriesRegistrationAPITransformer() {
    }
    SeriesRegistrationAPITransformer.transformFetchSeriesRegistrationSeriesList = function (data) {
        return {
            series: data.series.map(function (datum) {
                return {
                    application_deadline_date_formatted: datum.application_deadline_date_formatted,
                    icon: datum.icon,
                    id: datum.id,
                    name: datum.name,
                    overview_link: datum.links.overview
                };
            })
        };
    };
    SeriesRegistrationAPITransformer.transformApplicationDeadline = function (data) {
        var application_deadline_formatted = [data.date];
        if (data.time) {
            application_deadline_formatted.push(data.time);
        }
        return application_deadline_formatted.join(' ');
    };
    SeriesRegistrationAPITransformer.transformFetchSeriesSelectTeam = function (response_data) {
        var _this = this;
        return {
            series: this.transformSubpageSeriesSummary(response_data.series),
            teams: response_data.teams.map(function (team_datum) {
                return _this.transformSelectableTeam(team_datum);
            })
        };
    };
    SeriesRegistrationAPITransformer.transformSubpageSeriesSummary = function (series_data) {
        return {
            id: series_data.id,
            name: series_data.name,
            icon: series_data.icon,
            is_team_series: !!series_data.is_team_series,
            application_deadline_formatted: series_data.application_deadline_formatted,
            links: {
                overview: series_data.links.overview
            }
        };
    };
    SeriesRegistrationAPITransformer.transformSelectableTeam = function (data) {
        var button = data.selection_information.button;
        delete data.selection_information.button; // after extracting button from data, remove it to prevent application to parent classes
        return new _models__WEBPACK_IMPORTED_MODULE_0__["SeriesManagedTeam"](__assign({}, data, { select_button: button || null }));
    };
    return SeriesRegistrationAPITransformer;
}());



/***/ }),

/***/ "./src/js/SeriesRegistration/series-registration.ts":
/*!**********************************************************!*\
  !*** ./src/js/SeriesRegistration/series-registration.ts ***!
  \**********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pages_SeriesRegistrationIndexPage_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_pages/SeriesRegistrationIndexPage.vue */ "./src/js/SeriesRegistration/_pages/SeriesRegistrationIndexPage.vue");
/* harmony import */ var _pages_SeriesRegistrationSelectTeamPage_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_pages/SeriesRegistrationSelectTeamPage.vue */ "./src/js/SeriesRegistration/_pages/SeriesRegistrationSelectTeamPage.vue");
/* harmony import */ var _SeriesApplication_pages_SeriesApplicationPage_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SeriesApplication/_pages/SeriesApplicationPage.vue */ "./src/js/SeriesRegistration/SeriesApplication/_pages/SeriesApplicationPage.vue");
/* harmony import */ var _SeriesOverview_pages_SeriesOverviewPage_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SeriesOverview/_pages/SeriesOverviewPage.vue */ "./src/js/SeriesRegistration/SeriesOverview/_pages/SeriesOverviewPage.vue");
/* harmony import */ var _SeriesStandings_pages_SeriesStandingsPage_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SeriesStandings/_pages/SeriesStandingsPage.vue */ "./src/js/SeriesRegistration/SeriesStandings/_pages/SeriesStandingsPage.vue");
/* harmony import */ var _components_SeriesRegistrationEligibilityConfirmation_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_components/SeriesRegistrationEligibilityConfirmation.vue */ "./src/js/SeriesRegistration/_components/SeriesRegistrationEligibilityConfirmation.vue");
/* harmony import */ var _components_SeriesPageHeader_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_components/SeriesPageHeader.vue */ "./src/js/SeriesRegistration/_components/SeriesPageHeader.vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");








/**
 * Components
 */
vue__WEBPACK_IMPORTED_MODULE_7__["default"].component('series-page-header', _components_SeriesPageHeader_vue__WEBPACK_IMPORTED_MODULE_6__["default"]);
vue__WEBPACK_IMPORTED_MODULE_7__["default"].component('series-registration-eligibility-confirmation', _components_SeriesRegistrationEligibilityConfirmation_vue__WEBPACK_IMPORTED_MODULE_5__["default"]);
/**
 * Pages
 */
vue__WEBPACK_IMPORTED_MODULE_7__["default"].component('series-registration-index-page', _pages_SeriesRegistrationIndexPage_vue__WEBPACK_IMPORTED_MODULE_0__["default"]);
vue__WEBPACK_IMPORTED_MODULE_7__["default"].component('series-registration-select-team-page', _pages_SeriesRegistrationSelectTeamPage_vue__WEBPACK_IMPORTED_MODULE_1__["default"]);
vue__WEBPACK_IMPORTED_MODULE_7__["default"].component('series-registration-application-page', _SeriesApplication_pages_SeriesApplicationPage_vue__WEBPACK_IMPORTED_MODULE_2__["default"]);
vue__WEBPACK_IMPORTED_MODULE_7__["default"].component('series-registration-overview-page', _SeriesOverview_pages_SeriesOverviewPage_vue__WEBPACK_IMPORTED_MODULE_3__["default"]);
vue__WEBPACK_IMPORTED_MODULE_7__["default"].component('series-standings-page', _SeriesStandings_pages_SeriesStandingsPage_vue__WEBPACK_IMPORTED_MODULE_4__["default"]);


/***/ }),

/***/ "./src/js/Teams/_components/SelectTeamList.vue":
/*!*****************************************************!*\
  !*** ./src/js/Teams/_components/SelectTeamList.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectTeamList.vue?vue&type=template&id=03f2d647& */ "./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647&");
/* harmony import */ var _SelectTeamList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectTeamList.vue?vue&type=script&lang=ts& */ "./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SelectTeamList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/_components/SelectTeamList.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts&":
/*!******************************************************************************!*\
  !*** ./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectTeamList.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647&":
/*!************************************************************************************!*\
  !*** ./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectTeamList.vue?vue&type=template&id=03f2d647& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/_models/ManagedTeam.ts":
/*!*********************************************!*\
  !*** ./src/js/Teams/_models/ManagedTeam.ts ***!
  \*********************************************/
/*! exports provided: ManagedTeam */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ManagedTeam", function() { return ManagedTeam; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var ManagedTeam = /** @class */ (function () {
    function ManagedTeam(params) {
        this._links = {
            competition_portal: ''
        };
        this.id = params.id;
        this.level = params.level;
        this.member_number = params.member_number;
        this.membership_status = __assign({}, params.membership_status);
        this.name = params.name;
        this.selection_information = __assign({}, params.selection_information);
    }
    Object.defineProperty(ManagedTeam.prototype, "links", {
        get: function () {
            return this._links;
        },
        set: function (value) {
            this._links = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ManagedTeam.prototype, "is_selectable", {
        get: function () {
            return this.selection_information.is_selectable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ManagedTeam.prototype, "not_selectable_reason", {
        get: function () {
            if ('is_not_selectable_reason' in this.selection_information && this.selection_information.is_not_selectable_reason) {
                return this.selection_information.is_not_selectable_reason;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ManagedTeam.prototype, "not_selectable_link", {
        get: function () {
            if ('not_selectable_link' in this.selection_information && this.selection_information.not_selectable_link) {
                return this.selection_information.not_selectable_link;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return ManagedTeam;
}());



/***/ }),

/***/ "./src/js/Teams/_models/MyCompetitionsTeamsCompetition.ts":
/*!****************************************************************!*\
  !*** ./src/js/Teams/_models/MyCompetitionsTeamsCompetition.ts ***!
  \****************************************************************/
/*! exports provided: MyCompetitionsTeamsCompetition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyCompetitionsTeamsCompetition", function() { return MyCompetitionsTeamsCompetition; });
var MyCompetitionsTeamsCompetition = /** @class */ (function () {
    function MyCompetitionsTeamsCompetition(params) {
        this.end_date_pretty = params.end_date_pretty;
        this.icon = params.icon;
        this.id = params.id;
        this.links = params.links;
        this.name = params.name;
        this.start_date_pretty = params.start_date_pretty;
    }
    return MyCompetitionsTeamsCompetition;
}());



/***/ }),

/***/ "./src/js/Teams/_models/index.ts":
/*!***************************************!*\
  !*** ./src/js/Teams/_models/index.ts ***!
  \***************************************/
/*! exports provided: ManagedTeam, MyCompetitionsTeamsCompetition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ManagedTeam__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManagedTeam */ "./src/js/Teams/_models/ManagedTeam.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ManagedTeam", function() { return _ManagedTeam__WEBPACK_IMPORTED_MODULE_0__["ManagedTeam"]; });

/* harmony import */ var _MyCompetitionsTeamsCompetition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MyCompetitionsTeamsCompetition */ "./src/js/Teams/_models/MyCompetitionsTeamsCompetition.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MyCompetitionsTeamsCompetition", function() { return _MyCompetitionsTeamsCompetition__WEBPACK_IMPORTED_MODULE_1__["MyCompetitionsTeamsCompetition"]; });





/***/ }),

/***/ "./src/js/adaptors/APIAdaptors/AppAPIAdaptor.ts":
/*!******************************************************!*\
  !*** ./src/js/adaptors/APIAdaptors/AppAPIAdaptor.ts ***!
  \******************************************************/
/*! exports provided: AppAPIAdaptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppAPIAdaptor", function() { return AppAPIAdaptor; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var AppAPIAdaptor = /** @class */ (function () {
    function AppAPIAdaptor() {
    }
    AppAPIAdaptor.adaptSupportDocumentCategoryDataArrayToSupportDocumentCategoryArray = function (data) {
        return data.map(function (item) {
            return __assign({}, item);
        });
    };
    /**
     * Adapt a status message
     */
    AppAPIAdaptor.adaptStatusMessageData = function (data) {
        return {
            text: data.text,
            type_key: data.type_key || 'default'
        };
    };
    return AppAPIAdaptor;
}());



/***/ }),

/***/ "./src/js/adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor.ts":
/*!*******************************************************************!*\
  !*** ./src/js/adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor.ts ***!
  \*******************************************************************/
/*! exports provided: SkateTestHistoryAPIAdaptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkateTestHistoryAPIAdaptor", function() { return SkateTestHistoryAPIAdaptor; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var SkateTestHistoryAPIAdaptor = /** @class */ (function () {
    function SkateTestHistoryAPIAdaptor() {
    }
    SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory = function (data) {
        return __assign({}, data);
    };
    SkateTestHistoryAPIAdaptor.adaptSkateTestFormDataToIndividualSkateTestData = function (test_data) {
        return __assign({}, test_data, { test: test_data.test.value });
    };
    SkateTestHistoryAPIAdaptor.adaptSkateTestRemoveAppPayloadToSkateTestRemoveAPIPayload = function (remove_data) {
        return {
            discipline_key: remove_data.discipline.key,
            test_id: remove_data.test.id
        };
    };
    SkateTestHistoryAPIAdaptor.adaptPartnerSkateTestRemoveAppPayloadToPartnerSkateTestRemoveAPIPayload = function (remove_data) {
        return {
            discipline_key: remove_data.discipline.key,
            test: remove_data.test,
            partner_id: remove_data.partner_id
        };
    };
    SkateTestHistoryAPIAdaptor.adaptPartnerSkateTestAddAppPayloadToPartnerSkateTestAddAPIPayload = function (payload) {
        return __assign({}, payload, { test_data: SkateTestHistoryAPIAdaptor.adaptSkateTestFormDataToIndividualSkateTestData(payload.test_data) });
    };
    return SkateTestHistoryAPIAdaptor;
}());



/***/ }),

/***/ "./src/js/adaptors/APIAdaptors/UserAPIAdaptor.ts":
/*!*******************************************************!*\
  !*** ./src/js/adaptors/APIAdaptors/UserAPIAdaptor.ts ***!
  \*******************************************************/
/*! exports provided: UserAPIAdaptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserAPIAdaptor", function() { return UserAPIAdaptor; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var UserAPIAdaptor = /** @class */ (function () {
    function UserAPIAdaptor() {
    }
    UserAPIAdaptor.adaptUserProfileDataToUserProfile = function (profile_data) {
        return __assign({}, profile_data, { birth_date: {
                formatted: profile_data.birth_date.formatted,
                timestamp: profile_data.birth_date.timestamp * 1000
            } });
    };
    UserAPIAdaptor.adaptEditProfileFormStateToUserProfileData = function (profile_data) {
        /**
         * At this point, profile_data has been validated to ensure required properties are provided. Null coalescing is
         * here solely for type-safeness
         */
        return __assign({}, profile_data, { first_name: profile_data.first_name || "", last_name: profile_data.last_name || "", birth_date: profile_data.birth_date || "" });
    };
    UserAPIAdaptor.adaptUserWaiversToUserWaiverSaveData = function (user_waiver) {
        return {
            id: user_waiver.id,
            name: user_waiver.status.name,
            relationship: user_waiver.status.relationship
        };
    };
    UserAPIAdaptor.adaptUserWaiverDataToUserWaiver = function (user_waiver) {
        return __assign({}, user_waiver);
    };
    return UserAPIAdaptor;
}());



/***/ }),

/***/ "./src/js/adaptors/MemberSearchAdaptor.ts":
/*!************************************************!*\
  !*** ./src/js/adaptors/MemberSearchAdaptor.ts ***!
  \************************************************/
/*! exports provided: MemberSearchAdaptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MemberSearchAdaptor", function() { return MemberSearchAdaptor; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var MemberSearchAdaptor = /** @class */ (function () {
    function MemberSearchAdaptor() {
    }
    MemberSearchAdaptor.adaptResult = function (raw_data) {
        return __assign({}, raw_data);
    };
    MemberSearchAdaptor.adaptResultArray = function (raw_data) {
        return raw_data.map(function (item) {
            return MemberSearchAdaptor.adaptResult(item);
        });
    };
    MemberSearchAdaptor.adaptGenderedResultArray = function (raw_data) {
        return raw_data.map(function (item) {
            return __assign({}, item, MemberSearchAdaptor.adaptResult(item));
        });
    };
    MemberSearchAdaptor.adaptMemberSearchParametersToMemberSearchAPIParameters = function (search_params) {
        return __assign({}, search_params);
    };
    return MemberSearchAdaptor;
}());



/***/ }),

/***/ "./src/js/adaptors/UserDataAdaptor.ts":
/*!********************************************!*\
  !*** ./src/js/adaptors/UserDataAdaptor.ts ***!
  \********************************************/
/*! exports provided: UserAdaptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserAdaptor", function() { return UserAdaptor; });
/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/User */ "./src/js/models/User.ts");

var UserAdaptor = /** @class */ (function () {
    function UserAdaptor() {
    }
    UserAdaptor.adaptUser = function (raw_data) {
        var required_props = ['roles', 'upload_file_capability', 'member_number', 'email'];
        for (var i = 0; i < required_props.length; i++) {
            var prop = required_props[i];
            if (!(prop in raw_data)) {
                throw "Invalid user data";
            }
        }
        var sub_props = ["can_upload", "error_message"];
        for (var i = 0; i < sub_props.length; i++) {
            var prop = sub_props[i];
            if (!(prop in raw_data.upload_file_capability)) {
                throw "Invalid user data";
            }
        }
        if (typeof raw_data.upload_file_capability.can_upload === "string") {
            raw_data.upload_file_capability.can_upload = raw_data.upload_file_capability.can_upload === "true";
        }
        var valid_user_roles = ["skater", "coach", 'team_manager'];
        var user_roles = [];
        for (var i = 0; i < raw_data.roles.length; i++) {
            var data_type = raw_data.roles[i];
            if (valid_user_roles.indexOf(data_type) !== -1) {
                user_roles.push(data_type);
            }
        }
        var args = {
            roles: user_roles,
            upload_file_capability: {
                can_upload: raw_data.upload_file_capability.can_upload,
                error_message: raw_data.upload_file_capability.error_message
            },
            member_number: typeof raw_data.member_number !== 'number' ? parseInt(raw_data.member_number) : raw_data.member_number,
            email: raw_data.email
        };
        return new _models_User__WEBPACK_IMPORTED_MODULE_0__["User"](args);
    };
    return UserAdaptor;
}());



/***/ }),

/***/ "./src/js/components/MemberSearch/MemberSearchTakeover.vue":
/*!*****************************************************************!*\
  !*** ./src/js/components/MemberSearch/MemberSearchTakeover.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MemberSearchTakeover_vue_vue_type_template_id_57274bee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MemberSearchTakeover.vue?vue&type=template&id=57274bee& */ "./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=template&id=57274bee&");
/* harmony import */ var _MemberSearchTakeover_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MemberSearchTakeover.vue?vue&type=script&lang=ts& */ "./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MemberSearchTakeover_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _MemberSearchTakeover_vue_vue_type_template_id_57274bee___WEBPACK_IMPORTED_MODULE_0__["render"],
  _MemberSearchTakeover_vue_vue_type_template_id_57274bee___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/MemberSearch/MemberSearchTakeover.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=script&lang=ts&":
/*!******************************************************************************************!*\
  !*** ./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSearchTakeover_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./MemberSearchTakeover.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSearchTakeover_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=template&id=57274bee&":
/*!************************************************************************************************!*\
  !*** ./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=template&id=57274bee& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSearchTakeover_vue_vue_type_template_id_57274bee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./MemberSearchTakeover.vue?vue&type=template&id=57274bee& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/MemberSearch/MemberSearchTakeover.vue?vue&type=template&id=57274bee&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSearchTakeover_vue_vue_type_template_id_57274bee___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSearchTakeover_vue_vue_type_template_id_57274bee___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/components/MemberSearch/MemberSearchValidationFunctionFactory.ts":
/*!*********************************************************************************!*\
  !*** ./src/js/components/MemberSearch/MemberSearchValidationFunctionFactory.ts ***!
  \*********************************************************************************/
/*! exports provided: MemberSearchValidationFunctionFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MemberSearchValidationFunctionFactory", function() { return MemberSearchValidationFunctionFactory; });
var MemberSearchValidationFunctionFactory = /** @class */ (function () {
    function MemberSearchValidationFunctionFactory() {
    }
    /**
     * Get validation function to ensure result can only be selected if of the opposite gender of the current user
     */
    MemberSearchValidationFunctionFactory.opposite_gender = function (user_gender) {
        return function (member_result) {
            if (!user_gender) {
                return false;
            }
            return member_result.gender !== user_gender ? false : 'Must be opposite gender';
        };
    };
    /**
     * Get validation function to ensure result can only be selected if level compatibility with the current user exists
     */
    MemberSearchValidationFunctionFactory.compatible_levels = function (compare_levels) {
        return function (member_result) {
            // eslint-disable-next-line arrow-parens,arrow-body-style
            var result_level_ids = member_result.eligible_levels.map(function (level) { return level.id; });
            var intersection = compare_levels.filter(function (level) {
                return result_level_ids.indexOf(level.id) !== -1;
            });
            return intersection.length ? false : 'Incompatible Partner';
        };
    };
    return MemberSearchValidationFunctionFactory;
}());



/***/ }),

/***/ "./src/js/components/MemberSearch/MemberSearchValidators.ts":
/*!******************************************************************!*\
  !*** ./src/js/components/MemberSearch/MemberSearchValidators.ts ***!
  \******************************************************************/
/*! exports provided: validateResultActive */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateResultActive", function() { return validateResultActive; });
/**
 * Validate that a member search result has active status
 */
var validateResultActive = function (member_result) {
    return member_result.active ? false : 'Ineligible to Participate';
};


/***/ }),

/***/ "./src/js/components/SkateTests/SkateTests.vue":
/*!*****************************************************!*\
  !*** ./src/js/components/SkateTests/SkateTests.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SkateTests_vue_vue_type_template_id_6d561693___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SkateTests.vue?vue&type=template&id=6d561693& */ "./src/js/components/SkateTests/SkateTests.vue?vue&type=template&id=6d561693&");
/* harmony import */ var _SkateTests_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SkateTests.vue?vue&type=script&lang=ts& */ "./src/js/components/SkateTests/SkateTests.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SkateTests_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SkateTests_vue_vue_type_template_id_6d561693___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SkateTests_vue_vue_type_template_id_6d561693___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/SkateTests/SkateTests.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/SkateTests/SkateTests.vue?vue&type=script&lang=ts&":
/*!******************************************************************************!*\
  !*** ./src/js/components/SkateTests/SkateTests.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SkateTests_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./SkateTests.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/SkateTests/SkateTests.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SkateTests_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/SkateTests/SkateTests.vue?vue&type=template&id=6d561693&":
/*!************************************************************************************!*\
  !*** ./src/js/components/SkateTests/SkateTests.vue?vue&type=template&id=6d561693& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SkateTests_vue_vue_type_template_id_6d561693___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SkateTests.vue?vue&type=template&id=6d561693& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/SkateTests/SkateTests.vue?vue&type=template&id=6d561693&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SkateTests_vue_vue_type_template_id_6d561693___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SkateTests_vue_vue_type_template_id_6d561693___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



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

/***/ "./src/js/helpers/PromiseHelpers.ts":
/*!******************************************!*\
  !*** ./src/js/helpers/PromiseHelpers.ts ***!
  \******************************************/
/*! exports provided: enforcePromiseResolutionDuration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enforcePromiseResolutionDuration", function() { return enforcePromiseResolutionDuration; });
/**
 * Run a promise-based function, but ensure resolution doesn't occur before a specified amount of time
 */
function enforcePromiseResolutionDuration(enfore_duration_ms, method, args) {
    var start_time = new Date()
        .getTime();
    /**
     * Enforce an elapsed duration before running a callback function
     */
    function enforcedDuration(callback) {
        var current_time = new Date()
            .getTime();
        var elapsed = current_time - start_time;
        var wait_duration = enfore_duration_ms - elapsed;
        if (wait_duration <= 0) {
            callback();
            return;
        }
        setTimeout(function () {
            callback();
        }, wait_duration);
    }
    return new Promise(function (resolve, reject) {
        method.apply(void 0, args).then(function (args) {
            enforcedDuration(function () {
                resolve(args);
            });
        })
            .catch(function (args) {
            enforcedDuration(function () {
                reject(args);
            });
        });
    });
}


/***/ }),

/***/ "./src/js/helpers/SearchResultHelpers.ts":
/*!***********************************************!*\
  !*** ./src/js/helpers/SearchResultHelpers.ts ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var SearchResultHelpers = /** @class */ (function () {
    function SearchResultHelpers() {
    }
    SearchResultHelpers.getSpread = function (result_count, active_page_index, per_page) {
        if (result_count === 0) {
            return {
                start: 0,
                end: 0
            };
        }
        var start = 1;
        var end = result_count;
        if (typeof per_page === "number") {
            start = per_page * active_page_index + 1;
            end = per_page * (active_page_index + 1);
        }
        return {
            start: start,
            end: end < result_count ? end : result_count
        };
    };
    /**
     * Create pagination that always contains 7 items (unless source pages are shorter)
     * Pagination always includes first and last page
     * Pagination contains 5 remaining items surrounding the active page
     * For non-sequential pagination elements, display ellipsis.
     */
    SearchResultHelpers.getPaginationOptions = function (paginated_data, active_page_index) {
        var first_page = {
            page_number: 1,
            page_index: 0
        };
        var last_page = {
            page_number: paginated_data.length,
            page_index: paginated_data.length - 1
        };
        var result = [
            first_page,
            last_page
        ];
        /**
         * If only 1 page of data, return the first item in our result set
         */
        if (paginated_data.length === 1) {
            return result.splice(0, 1);
        }
        var spread = SearchResultHelpers.getPaginationSpread(paginated_data, active_page_index);
        result.splice.apply(result, [1, 0].concat(spread));
        /**
         *
         */
        return result.map(function (item, index) {
            /**
             * Preserve first and last items
             */
            if (index === 0 || index === result.length - 1) {
                return item;
            }
            var previous_item = result[index - 1];
            var next_item = result[index + 1];
            /**
             * If a next item isn't sequentially 1 step above the current, replace current with ellipsis
             */
            if (next_item && next_item.page_number > item.page_number + 1) {
                return {
                    page_number: "...",
                    page_index: false
                };
            }
            /**
             * If a previous item isn't sequentially 1 step below the current, replace current with ellipsis
             */
            if (previous_item && previous_item.page_number < item.page_number - 1) {
                return {
                    page_number: "...",
                    page_index: false
                };
            }
            return item;
        });
    };
    /**
     * Get the spread of pages surrounding the active page
     */
    SearchResultHelpers.getPaginationSpread = function (paginated_data, active_page_index) {
        var full_spread_length = 5;
        var spread = [];
        var max_spread = paginated_data.length - 2;
        var spread_length = max_spread < full_spread_length ? max_spread : full_spread_length;
        /**
         * Add the active page first if it's not the first or last page
         */
        var active_page_not_first = active_page_index > 0;
        var active_page_not_last = active_page_index < paginated_data.length - 1;
        if (active_page_not_first && active_page_not_last) {
            spread.push({
                page_number: active_page_index + 1,
                page_index: active_page_index
            });
        }
        /**
         * Build the spread according to it's length.
         *
         * Add previous pages while applicable before the current spread
         * Add next pages while applicable to the end of the spread
         */
        for (var j = 1; j <= spread_length; j++) {
            var previous_index = active_page_index - j;
            var next_index = active_page_index + j;
            if (previous_index > 0) {
                spread.unshift({
                    page_number: previous_index + 1,
                    page_index: previous_index
                });
            }
            if (next_index < paginated_data.length - 1) {
                spread.push({
                    page_number: next_index + 1,
                    page_index: next_index
                });
            }
            if (spread.length >= spread_length) {
                break;
            }
        }
        return spread;
    };
    return SearchResultHelpers;
}());
/* harmony default export */ __webpack_exports__["default"] = (SearchResultHelpers);


/***/ }),

/***/ "./src/js/helpers/StringHelpers.ts":
/*!*****************************************!*\
  !*** ./src/js/helpers/StringHelpers.ts ***!
  \*****************************************/
/*! exports provided: StringHelpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StringHelpers", function() { return StringHelpers; });
/* eslint-disable no-inner-declarations */
var StringHelpers;
(function (StringHelpers) {
    /**
     * Convert a string to title case
     */
    function titleCase(str) {
        var mod = str.toLowerCase()
            .split(' ');
        for (var i = 0; i < mod.length; i++) {
            mod[i] = mod[i].charAt(0)
                .toUpperCase() + mod[i].slice(1);
        }
        return mod.join(' ');
    }
    StringHelpers.titleCase = titleCase;
    /**
     * Convert a string in snake_case to kebab-case
     */
    function kebabCaseFromSnakeCase(str) {
        return str.replace(/_/g, '-');
    }
    StringHelpers.kebabCaseFromSnakeCase = kebabCaseFromSnakeCase;
    /**
     * Insert a new string at a position within the string
     */
    function splice(string, position, add) {
        return string.slice(0, position) + add + string.slice(position);
    }
    StringHelpers.splice = splice;
    /**
     * Escape a string that may contain regex characters
     */
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    StringHelpers.escapeRegex = escapeRegex;
    /**
     * Format a key into a display string
     *
     * Replace underscores with spaces
     */
    function displayFromKey(string) {
        return string.replace(/_/g, ' ');
    }
    StringHelpers.displayFromKey = displayFromKey;
})(StringHelpers || (StringHelpers = {}));


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

/***/ "./src/js/mixins/HasPaginatedItems.ts":
/*!********************************************!*\
  !*** ./src/js/mixins/HasPaginatedItems.ts ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_PaginationService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/PaginationService */ "./src/js/services/PaginationService.ts");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");


/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_1__["default"].extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * The active page of paginated results
             */
            active_page_index: 0,
            /**
             * The amount of items per page of pagination
             */
            pagination_per_page: 50
        };
    },
    computed: {
        /**
         * The items to paginate
         */
        pagination_items: function () {
            return [];
        },
        /**
         * Paginated items that have passed all active filters
         */
        paginated_items: function () {
            return _services_PaginationService__WEBPACK_IMPORTED_MODULE_0__["PaginationService"].paginate(this.pagination_items, this.pagination_per_page);
        },
        /**
         * The pagination component element
         */
        pagination_component: function () {
            return this.$refs.pagination ? this.$refs.pagination : null;
        },
        /**
         * Whether to show the pagination
         *
         * If there is more than one page of paginated items
         */
        show_pagination: function () {
            return this.paginated_items.length > 1;
        },
        /**
         * The set of items currently visible on the active pagination page
         */
        visible_items: function () {
            return this.paginated_items[this.active_page_index];
        }
    },
    watch: {
        /**
         * When pagination items change, reset the active page to the first
         */
        pagination_items: function () {
            this.changeActivePage(0);
        }
    },
    methods: {
        /**
         * Set the active page within the component and its dependents
         */
        changeActivePage: function (page_index) {
            this.active_page_index = page_index;
            var pagination_component = this.$refs.pagination;
            if (pagination_component) {
                pagination_component.setActivePage(page_index);
            }
        },
        /**
         * Handle active page change reported by pagination component
         */
        handleActivePageChange: function (page_index) {
            this.active_page_index = page_index;
        }
    }
}));


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

/***/ "./src/js/models/User.ts":
/*!*******************************!*\
  !*** ./src/js/models/User.ts ***!
  \*******************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
var User = /** @class */ (function () {
    function User(params) {
        this._member_number = 123456;
        this._email = "test@test.com";
        this._roles = params.roles;
        this._upload_file_capability = params.upload_file_capability;
        this._email = params.email;
        this._member_number = params.member_number;
    }
    Object.defineProperty(User.prototype, "email", {
        get: function () {
            return this._email;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "member_number", {
        get: function () {
            return this._member_number;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "upload_file_capability", {
        get: function () {
            return this._upload_file_capability;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "roles", {
        get: function () {
            return this._roles;
        },
        enumerable: true,
        configurable: true
    });
    User.blank = function () {
        return new User({
            roles: ["skater"],
            upload_file_capability: {
                can_upload: true,
                error_message: ''
            },
            member_number: -1,
            email: ""
        });
    };
    return User;
}());



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

/***/ "./src/js/series-registration.ts":
/*!***************************************!*\
  !*** ./src/js/series-registration.ts ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SeriesRegistration_series_registration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeriesRegistration/series-registration */ "./src/js/SeriesRegistration/series-registration.ts");



/***/ }),

/***/ "./src/js/services/AbstractAPIService.ts":
/*!***********************************************!*\
  !*** ./src/js/services/AbstractAPIService.ts ***!
  \***********************************************/
/*! exports provided: AbstractAPIService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractAPIService", function() { return AbstractAPIService; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../adaptors/MemberSearchAdaptor */ "./src/js/adaptors/MemberSearchAdaptor.ts");


var AbstractAPIService = /** @class */ (function () {
    function AbstractAPIService() {
    }
    /**
     * Fetch information from the API and transform the response
     */
    AbstractAPIService.fetchAndTransformResponse = function (parameters) {
        var url = parameters.url, validateResponse = parameters.validateResponse, transformResponse = parameters.transformResponse;
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(url)
                .then(function (response) {
                if (typeof validateResponse === 'undefined' || validateResponse(response.data)) {
                    resolve(transformResponse(response.data));
                    return;
                }
                reject();
            })
                .catch(function () {
                reject();
            });
        });
    };
    /**
     * Submit an API request and handle the expected APISubmissionResponse response
     */
    AbstractAPIService.submitForAPISubmissionResponse = function (parameters) {
        var url = parameters.url, payload = parameters.payload;
        var error_message = parameters.error_message;
        var method = parameters.method || 'post';
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.request({
                data: payload,
                url: url,
                method: method
            })
                .then(function (response) {
                if (response.data && response.data.success) {
                    resolve();
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            })
                .catch(function () {
                reject(error_message);
            });
        });
    };
    /**
     * Submit a member search
     */
    AbstractAPIService.submitMemberSearch = function (parameters) {
        var error_message = parameters.error_message || 'Search error. Please try again';
        var payload = parameters.payload, url = parameters.url;
        var transform = parameters.transformPayload || (function (data) {
            return _adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_1__["MemberSearchAdaptor"].adaptMemberSearchParametersToMemberSearchAPIParameters(data);
        });
        var api_payload = transform(payload);
        var validateResponse = parameters.validateResponse || (function (response_data) {
            return !!response_data && !!response_data.results;
        });
        var transformResponse = parameters.transformResponse || (function (response_data) {
            return _adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_1__["MemberSearchAdaptor"].adaptResultArray(response_data.results);
        });
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(url, api_payload)
                .then(function (response) {
                if (validateResponse(response.data)) {
                    resolve(transformResponse(response.data));
                    return;
                }
                reject(error_message);
            })
                .catch(function () {
                reject(error_message);
            });
        });
    };
    /**
     * Submit an API request with an expected response payload. Validate then transform the response payload
     *
     * R represents the API response
     * O represents the transformed outcome
     */
    AbstractAPIService.submitWithTransformedResponse = function (parameters) {
        var url = parameters.url, payload = parameters.payload, transformResponse = parameters.transformResponse;
        var method = parameters.method || 'post';
        var validateResponse = parameters.validateResponse || (function (response_data) {
            return !!response_data && !!response_data.success;
        });
        var error_message = parameters.error_message;
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.request({
                data: payload,
                url: url,
                method: method
            })
                .then(function (response) {
                if (validateResponse(response.data)) {
                    resolve(transformResponse(response.data));
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            })
                .catch(function () {
                reject(error_message);
            });
        });
    };
    /**
     * Get a value from a cookie using the cookie name
     */
    AbstractAPIService.getValueFromCookie = function (cookie_name, cookie_descriptor, suppress_warnings) {
        if (cookie_descriptor === void 0) { cookie_descriptor = ''; }
        var cookie_value = '';
        if (cookie_name) {
            var pattern = "(?:(?:^|.*;\\s*)" + cookie_name + "\\s*\\=\\s*([^;]*).*$)|^.*$";
            var cookieValue = document.cookie.replace(new RegExp(pattern), '$1');
            cookie_value = cookieValue.trim();
            if (cookie_value !== '') {
                return cookie_value;
            }
        }
        if (!suppress_warnings) {
            console.warn("Unable to retrieve " + cookie_descriptor + " cookie value");
        }
        throw "Unable to retrieve " + cookie_descriptor + " cookie value";
    };
    return AbstractAPIService;
}());



/***/ }),

/***/ "./src/js/services/BaseFilterService.ts":
/*!**********************************************!*\
  !*** ./src/js/services/BaseFilterService.ts ***!
  \**********************************************/
/*! exports provided: BaseFilterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseFilterService", function() { return BaseFilterService; });
/**
 * Base level filterer with abstract filter methods
 */
var BaseFilterService = /** @class */ (function () {
    function BaseFilterService() {
    }
    /**
     * Whether a value passes a string filter
     */
    BaseFilterService.valuePassesStringFilter = function (source_value, filter_value) {
        return !!source_value.toLowerCase()
            .match(filter_value.toLowerCase());
    };
    return BaseFilterService;
}());



/***/ }),

/***/ "./src/js/services/MemberSearchService.ts":
/*!************************************************!*\
  !*** ./src/js/services/MemberSearchService.ts ***!
  \************************************************/
/*! exports provided: MemberSearchService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MemberSearchService", function() { return MemberSearchService; });
/* harmony import */ var _AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractAPIService */ "./src/js/services/AbstractAPIService.ts");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../adaptors/MemberSearchAdaptor */ "./src/js/adaptors/MemberSearchAdaptor.ts");
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



var MemberSearchService = /** @class */ (function (_super) {
    __extends(MemberSearchService, _super);
    function MemberSearchService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Generic member search and response transformation
     */
    MemberSearchService.memberSearch = function (search_params, url_override) {
        var url = url_override || '/api/member-search';
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_1___default.a.post(url, _adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_2__["MemberSearchAdaptor"].adaptMemberSearchParametersToMemberSearchAPIParameters(search_params))
                .then(function (response) {
                if (response.data.results) {
                    resolve(_adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_2__["MemberSearchAdaptor"].adaptResultArray(response.data.results));
                }
                reject();
            })
                .catch(function () {
                reject();
            });
        });
    };
    return MemberSearchService;
}(_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"]));



/***/ }),

/***/ "./src/js/services/PaginationService.ts":
/*!**********************************************!*\
  !*** ./src/js/services/PaginationService.ts ***!
  \**********************************************/
/*! exports provided: PaginationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaginationService", function() { return PaginationService; });
/* harmony import */ var _helpers_SearchResultHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/SearchResultHelpers */ "./src/js/helpers/SearchResultHelpers.ts");

/**
 * New service class to wrap previously-existing functions
 */
var PaginationService = /** @class */ (function () {
    function PaginationService() {
    }
    /**
     * Paginate an array of items
     */
    PaginationService.paginate = function (items, per_page) {
        if (items.length === 0) {
            return [[]];
        }
        var result = [];
        return items.reduce(function (accumulator, item, index) {
            var result_index = 0;
            if (typeof per_page === "number") {
                result_index = Math.floor(index / per_page);
            }
            if (!accumulator[result_index]) {
                accumulator[result_index] = [];
            }
            accumulator[result_index].push(item);
            return accumulator;
        }, result);
    };
    /**
     * Get the options to display in pagination
     */
    PaginationService.paginationOptions = function (paginated_data, active_page_index) {
        return _helpers_SearchResultHelpers__WEBPACK_IMPORTED_MODULE_0__["default"].getPaginationOptions(paginated_data, active_page_index);
    };
    return PaginationService;
}());



/***/ }),

/***/ "./src/js/services/UserService.ts":
/*!****************************************!*\
  !*** ./src/js/services/UserService.ts ***!
  \****************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adaptors_UserDataAdaptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../adaptors/UserDataAdaptor */ "./src/js/adaptors/UserDataAdaptor.ts");
/* harmony import */ var _adaptors_APIAdaptors_UserAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../adaptors/APIAdaptors/UserAPIAdaptor */ "./src/js/adaptors/APIAdaptors/UserAPIAdaptor.ts");
/* harmony import */ var _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor */ "./src/js/adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor.ts");




var UserService = /** @class */ (function () {
    function UserService() {
    }
    /**
     * Get general information about the logged in user
     */
    UserService.getUserInfo = function (competition_id) {
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/user/info', {
                competition_id: competition_id
            }).then(function (response) {
                if (response.data.user) {
                    resolve(_adaptors_UserDataAdaptor__WEBPACK_IMPORTED_MODULE_1__["UserAdaptor"].adaptUser(response.data.user));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    };
    UserService.saveProfile = function (profile_data) {
        var error_message = "Error saving profile.";
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/user/profile', {
                profile_data: _adaptors_APIAdaptors_UserAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__["UserAPIAdaptor"].adaptEditProfileFormStateToUserProfileData(profile_data)
            }).then(function (response) {
                if (response.data.success && response.data.profile) {
                    resolve(_adaptors_APIAdaptors_UserAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__["UserAPIAdaptor"].adaptUserProfileDataToUserProfile(response.data.profile));
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    };
    UserService.getProfile = function () {
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.get('/api/user/profile').then(function (response) {
                if (response.data.profile) {
                    resolve(_adaptors_APIAdaptors_UserAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__["UserAPIAdaptor"].adaptUserProfileDataToUserProfile(response.data.profile));
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    };
    UserService.saveWaivers = function (waiver_data) {
        var error_message = "Error saving waiver information.";
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/user/waivers', {
                waivers_data: waiver_data.map(function (user_waiver) {
                    return _adaptors_APIAdaptors_UserAPIAdaptor__WEBPACK_IMPORTED_MODULE_2__["UserAPIAdaptor"].adaptUserWaiversToUserWaiverSaveData(user_waiver);
                })
            }).then(function (response) {
                if (response.data.success) {
                    resolve();
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    };
    UserService.getSkateTestHistory = function (partner_id) {
        return new Promise(function (resolve, reject) {
            var post_data = partner_id ? { partner_id: partner_id } : null;
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/user/skate-test-history', post_data).then(function (response) {
                if (response.data.skate_test_history) {
                    var userSkateTestHistory = _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_3__["SkateTestHistoryAPIAdaptor"].adaptUserSkateTestHistoryDataToUserSkateTestHistory(response.data.skate_test_history);
                    resolve(userSkateTestHistory);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    };
    UserService.addSkateTest = function (test_data, discipline_key) {
        var error_message = "Error saving skate test.";
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/user/skate-test-history/add', {
                test_data: _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_3__["SkateTestHistoryAPIAdaptor"].adaptSkateTestFormDataToIndividualSkateTestData(test_data),
                discipline_key: discipline_key
            }).then(function (response) {
                if (response.data.success && response.data.skate_test_history) {
                    var userSkateTestHistory = _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_3__["SkateTestHistoryAPIAdaptor"].adaptUserSkateTestHistoryDataToUserSkateTestHistory(response.data.skate_test_history);
                    resolve(userSkateTestHistory);
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    };
    UserService.removeSkateTest = function (remove_data) {
        var error_message = "Error removing skate test.";
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/api/user/skate-test-history/remove', _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_3__["SkateTestHistoryAPIAdaptor"].adaptSkateTestRemoveAppPayloadToSkateTestRemoveAPIPayload(remove_data)).then(function (response) {
                if (response.data.success && response.data.skate_test_history) {
                    var userSkateTestHistory = _adaptors_APIAdaptors_SkateTestHistoryAPIAdaptor__WEBPACK_IMPORTED_MODULE_3__["SkateTestHistoryAPIAdaptor"].adaptUserSkateTestHistoryDataToUserSkateTestHistory(response.data.skate_test_history);
                    resolve(userSkateTestHistory);
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    };
    return UserService;
}());



/***/ }),

/***/ "./src/js/store/Modules/MemberSearchState.ts":
/*!***************************************************!*\
  !*** ./src/js/store/Modules/MemberSearchState.ts ***!
  \***************************************************/
/*! exports provided: State, MemberSearchState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MemberSearchState", function() { return MemberSearchState; });
/* harmony import */ var _helpers_SearchResultHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/SearchResultHelpers */ "./src/js/helpers/SearchResultHelpers.ts");

var State = /** @class */ (function () {
    function State() {
        /**
         * Additional functions to validate search form
         */
        this.additional_form_validators = [];
        /**
         * Whether results are active
         */
        this.results_active = false;
        /**
         * Set of search results
         */
        this.results = [];
        /**
         * Array of member IDs to prevent selection (as already selected)
         */
        this.block_previous_selection = [];
        /**
         * State form options for search form
         */
        this.state_options = [];
        /**
         * Currently active amount of items per page
         */
        this.per_page = 10;
        /**
         * The index of the active page of results
         */
        this.active_page_index = 0;
        /**
         * The instruction to display in the ineligible member popup
         */
        this.ineligible_instruction = "Please choose another coach or leave blank";
        /**
         * The descriptor for the search entity type
         */
        this.entity_descriptor = "Member";
        /**
         * Function to determine if there was an error loading the search form
         */
        this.search_form_load_error_check = (function () {
            return false;
        });
    }
    return State;
}());

var actions = {
    /**
     * Run a search for members
     */
    runSearch: function (context, search_params) {
        return new Promise(function (resolve, reject) {
            var searchFunction = context.state.search_function;
            if (!searchFunction) {
                console.error("No member search function specified");
                reject();
                return;
            }
            searchFunction(search_params).then(function (member_results) {
                context.commit('setSearchResults', member_results);
                context.commit('setActivePageIndex', 0);
                context.commit('setPerPage', context.getters.per_page_options[0].value);
                resolve(member_results);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Handle selection of a member
     */
    handleSelection: function (context, member) {
        return new Promise(function (resolve, reject) {
            var selectionMethod = context.state.selection_method;
            if (!selectionMethod) {
                console.error('No selection method configured');
                reject('Error selecting member.');
                return;
            }
            selectionMethod(member).then(function () {
                resolve();
            }).catch(function (message) {
                reject(message);
            });
        });
    }
};
var getters = {
    /**
     * Determine if a result should be blocked for selection and display as already selected
     */
    previously_selected_selection_blocked: function (state) {
        return function (member_id) {
            return state.block_previous_selection.indexOf(member_id) !== -1;
        };
    },
    /**
     * The amount of results
     */
    result_count: function (state) {
        return state.results.length;
    },
    /**
     * The options for "per page" selection
     */
    per_page_options: function (state, getters) {
        var base_options = [10, 25];
        var result = [];
        for (var i = 0; i < base_options.length; i++) {
            var option = base_options[i];
            if (option <= getters.result_count) {
                result.push({
                    label: String(option),
                    value: option
                });
            }
        }
        result.push({
            label: "All",
            value: "all"
        });
        return result;
    },
    /**
     * The paginated set of search results
     */
    paginated_results: function (state) {
        var per_page = state.per_page;
        var result = [];
        return state.results.reduce(function (accumulator, item, index) {
            var result_index = 0;
            if (typeof per_page === "number") {
                result_index = Math.floor(index / per_page);
            }
            if (!accumulator[result_index]) {
                accumulator[result_index] = [];
            }
            accumulator[result_index].push(item);
            return accumulator;
        }, result);
    },
    /**
     * Form state options
     */
    state_options: function (state) {
        return state.state_options;
    },
    /**
     * Get the display results from the paginated list for the active page
     */
    active_results: function (state, getters) {
        return getters.paginated_results[state.active_page_index];
    },
    /**
     * Current begin and end page range
     */
    current_spread: function (state, getters) {
        return _helpers_SearchResultHelpers__WEBPACK_IMPORTED_MODULE_0__["default"].getSpread(getters.result_count, state.active_page_index, state.per_page);
    },
    /**
     * Options to show in pagination
     */
    pagination_options: function (state, getters) {
        return _helpers_SearchResultHelpers__WEBPACK_IMPORTED_MODULE_0__["default"].getPaginationOptions(getters.paginated_results, state.active_page_index);
    },
    /**
     * Whether pagination is available
     */
    pagination_available: function (state, getters) {
        return getters.pagination_options.length > 1;
    },
    /**
     * Get the string reason a member result is invalid, or false if the result is valid
     * Determined through additional validation functions added to state
     */
    memberResultInvalid: function (state, getters) {
        return function (member_result) {
            if (!state.result_validators) {
                return false;
            }
            for (var i = 0; i < state.result_validators.length; i++) {
                var memberValidator = state.result_validators[i];
                var error = memberValidator((member_result));
                if (error) {
                    return error;
                }
            }
            return false;
        };
    },
    search_form_load_error: function (state) {
        return state.search_form_load_error_check();
    }
};
var mutations = {
    setResultsActive: function (state, active) {
        state.results_active = active;
    },
    setSearchResults: function (state, member_results) {
        state.results = member_results;
    },
    setStateOptions: function (state, options) {
        state.state_options = options;
    },
    closeSearch: function (state) {
        var closeMethod = state.close_method;
        if (closeMethod) {
            closeMethod();
            return;
        }
        console.error('No close method configured');
    },
    setPerPage: function (state, per_page) {
        state.per_page = per_page;
    },
    setActivePageIndex: function (state, page_index) {
        state.active_page_index = page_index;
    },
    /**
     * Set the list of ids to display as previously selected
     */
    setBlockedPreviousSelection: function (state, previous_selection) {
        state.block_previous_selection = previous_selection;
    },
    /**
     * Configure the search
     */
    configure: function (state, config) {
        if (config.search_function) {
            state.search_function = config.search_function;
        }
        if (config.selection_method) {
            state.selection_method = config.selection_method;
        }
        if (config.close_method) {
            state.close_method = config.close_method;
        }
        if (config.ineligible_instruction) {
            state.ineligible_instruction = config.ineligible_instruction;
        }
        if (config.entity_descriptor) {
            state.entity_descriptor = config.entity_descriptor;
        }
        if (config.result_validators) {
            state.result_validators = config.result_validators;
        }
        if (config.form_validators) {
            state.additional_form_validators = config.form_validators;
        }
    },
    /**
     * Set function to evaluate to determine if there was a search form load error
     */
    setFormLoadErrorCheckFunction: function (state, payload) {
        state.search_form_load_error_check = payload;
    }
};
var MemberSearchState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/store/Modules/SkateTestHistoryState.ts":
/*!*******************************************************!*\
  !*** ./src/js/store/Modules/SkateTestHistoryState.ts ***!
  \*******************************************************/
/*! exports provided: State, SkateTestHistoryState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkateTestHistoryState", function() { return SkateTestHistoryState; });
/* harmony import */ var _services_UserService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/UserService */ "./src/js/services/UserService.ts");

/* eslint-enable */
var State = /** @class */ (function () {
    function State() {
        /**
         * The active discipline being modified with a new skate test
         */
        this.active_discipline = null;
        /**
         * The active user's skate test history
         */
        this.user_skate_test_history = null;
        /**
         * Action to use when saving a skate test instead of the default action
         */
        this.save_action = null;
        /**
         * Action to use when removing a skate test instead of the default action
         */
        this.remove_action = null;
    }
    return State;
}());

var actions = {
    /* eslint-disable */
    /**
     * Fetch a user's skate test history.  If partner_id is provided, fetch partner skate test
     */
    fetchSkateTestHistory: function (context, partner_id) {
        return new Promise(function (resolve, reject) {
            _services_UserService__WEBPACK_IMPORTED_MODULE_0__["UserService"].getSkateTestHistory(partner_id).then(function (user_skate_test_history) {
                context.commit('setActiveSkateTestHistory', user_skate_test_history);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },
    /* eslint-enable */
    /**
     * Save a skate test
     */
    saveTest: function (context, test_data) {
        var active_discipline = context.getters.active_discipline;
        return new Promise(function (resolve, reject) {
            var action = context.state.save_action || function (payload) {
                return _services_UserService__WEBPACK_IMPORTED_MODULE_0__["UserService"].addSkateTest(payload.test_data, payload.active_discipline.key);
            };
            var payload = {
                test_data: test_data,
                active_discipline: active_discipline
            };
            action(payload)
                .then(function (updated_test_history) {
                context.commit('setActiveSkateTestHistory', updated_test_history);
                resolve();
            })
                .catch(function (error_message) {
                reject(error_message);
            });
        });
    },
    /**
     * Remove a skate test
     */
    removeTest: function (context, remove_data) {
        return new Promise(function (resolve, reject) {
            var action = context.state.remove_action || _services_UserService__WEBPACK_IMPORTED_MODULE_0__["UserService"].removeSkateTest;
            action(remove_data)
                .then(function (updated_test_history) {
                context.commit('setActiveSkateTestHistory', updated_test_history);
                resolve();
            })
                .catch(function (error_message) {
                reject(error_message);
            });
        });
    }
};
/* eslint-disable */
var getters = {
    /**
     * Get the active discipline if it exists
     */
    active_discipline: function (state) {
        return state.active_discipline;
    },
    /**
     * Get the active skate test history, if it's been fetched
     */
    user_skate_test_history: function (state) {
        return state.user_skate_test_history;
    },
    /**
     * Get the list of skate test disciplines containing self-reported skate tests
     */
    user_self_reported_test_disciplines: function (state) {
        var userSkateTestHistory = state.user_skate_test_history;
        if (!userSkateTestHistory) {
            return [];
        }
        return userSkateTestHistory.disciplines.filter(function (discipline) {
            return discipline.self_reported_tests.length;
        });
    },
    /**
     * Get the list of available test options for the active discipline
     */
    active_discipline_test_options: function (state) {
        if (!state.active_discipline) {
            return [];
        }
        return state.active_discipline.available_tests;
    }
};
/* eslint-enable */
var mutations = {
    /* eslint-disable */
    setActiveDiscipline: function (state, discipline) {
        state.active_discipline = discipline;
    },
    setActiveSkateTestHistory: function (state, skate_test_history) {
        state.user_skate_test_history = skate_test_history;
    },
    /* eslint-enable */
    /**
     * Set the remove action to use in state
     */
    setRemoveAction: function (state, payload) {
        state.remove_action = payload;
    },
    /**
     * Set the save action to use in state
     */
    setSaveAction: function (state, payload) {
        state.save_action = payload;
    },
    /**
     * Reset state to defaults
     */
    reset: function (state) {
        state.save_action = null;
        state.remove_action = null;
    }
    /* eslint-disable */
};
var SkateTestHistoryState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ 6:
/*!*********************************************!*\
  !*** multi ./src/js/series-registration.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Test\Figure\hawkeye-ems\src\js\series-registration.ts */"./src/js/series-registration.ts");


/***/ })

},[[6,"/js/manifest","/js/vendor"]]]);