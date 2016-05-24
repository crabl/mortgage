'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = mortgage;
exports.amortize = amortize;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// amortization table with equity calculation, factor in appreciation and PMI
function round(amount) {
  return Math.round(amount * 100) / 100;
}

function effectiveRate(rate, compound_periods, payment_schedule) {
  return Math.pow(1 + rate / compound_periods, compound_periods / payment_schedule) - 1;
}

function mortgage(amount, annual_rate, number_of_payments, payment_schedule) {
  var PV = amount;
  var r = effectiveRate(annual_rate, 2, payment_schedule); // Canadian mortgages are compounded semi-annually
  var n = number_of_payments;

  if (r === 0) {
    return round(PV / n);
  }

  // This is the formula to obtain payments for an annuity due based on the "present value" of the vehicle
  // which is actually the future value of the principal at the simple daily interest rate over the number
  // of days until the first payment of the annuity due occurs.
  //
  // In this instance, the variable 'n' represents the number of distinct monthly payments:
  //
  //  0    1    2             47   48
  //  |____|____|____ ... ____|____|
  //  P    PV                      FV
  //
  // More info: http://www.financeformulas.net/Annuity-Due-Payment-from-Present-Value.html

  return round(PV * (r / (1 - Math.pow(1 + r, -n))));
}

function amortize(home_value, annual_rate, number_of_payments, payment_schedule, down_payment_percent) {
  var pmi = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
  var annual_appreciation = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

  var equity = home_value * down_payment_percent;
  var debt = home_value - equity + pmi;
  var payment = mortgage(debt, annual_rate, number_of_payments, payment_schedule);

  var initial = {
    home_value: home_value,
    equity: equity,
    debt: debt,
    interest: 0,
    principal: 0,
    payment: payment
  };

  var effectiveMonthlyRate = effectiveRate(annual_rate, 2, payment_schedule);

  return _lodash2['default'].range(0, number_of_payments).reduce(function (table, n, i) {
    var prevState = table[i];

    var home_value = round(prevState.home_value * (1 + annual_appreciation / 12));
    var interest = round(prevState.debt * effectiveMonthlyRate);
    var principal = round(payment - interest);
    var debt = round(prevState.debt - principal);
    var equity = round(home_value - debt);

    var nextState = {
      home_value: home_value,
      equity: equity,
      debt: debt,
      interest: interest,
      principal: principal,
      payment: payment
    };

    return [].concat(_toConsumableArray(table), [nextState]);
  }, [initial]);
}