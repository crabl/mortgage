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
