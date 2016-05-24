function round(amount) {
  return Math.round(amount * 100) / 100;
}

function effectiveRate(rate, compound_periods, payment_schedule) {
  return Math.pow(1 + (rate / compound_periods), compound_periods / payment_schedule) - 1;
}

export default function mortgage(amount, annual_rate, number_of_payments, payment_schedule) {
  const PV = amount;
  const r = effectiveRate(annual_rate, 2, payment_schedule); // Canadian mortgages are compounded semi-annually
  const n = number_of_payments;

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

import _ from 'lodash';

// amortization table with equity calculation, factor in appreciation and PMI
export function amortize(home_value, annual_rate, number_of_payments, payment_schedule, down_payment_percent, pmi=0, annual_appreciation=0) {
  const equity = home_value * down_payment_percent;
  const debt = home_value - equity + pmi;
  const payment = mortgage(debt, annual_rate, number_of_payments, payment_schedule);

  const initial = {
    home_value,
    equity,
    debt,
    interest: 0,
    principal: 0,
    payment
  };

  const effectiveMonthlyRate = effectiveRate(annual_rate, 2, payment_schedule);

  return _.range(0, number_of_payments).reduce((table, n, i) => {
    const prevState = table[i];

    const home_value = round(prevState.home_value * (1 + annual_appreciation / 12));
    const interest = round(prevState.debt * effectiveMonthlyRate);
    const principal = round(payment - interest);
    const debt = round(prevState.debt - principal);
    const equity = round(home_value - debt);

    const nextState = {
      home_value,
      equity,
      debt,
      interest,
      principal,
      payment
    };

    return [...table, nextState];
  }, [initial]);
}
