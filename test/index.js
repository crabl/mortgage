import assert from 'assert';
import mortgage from '../lib';

function round(amount) {
  return Math.round(amount * 100) / 100;
}

describe('mortgage', () => {
  it('should calculate correct payment amount without interest', () => {
    const amount = 230000; // $
    const annual_rate = 0; // 0%
    const term = 25; // years
    const payment_schedule = 12; // payments per year
    const number_of_payments = term * payment_schedule;
    const payment = mortgage(amount, annual_rate, number_of_payments, payment_schedule);

    assert.equal(payment, round(amount / number_of_payments));
  });

  it('should calculate correct payment amount with interest', () => {
    const amount = 230000; // $
    const annual_rate = 0.0464; // 4.64%
    const term = 25; // years
    const payment_schedule = 12; // payments per year
    const number_of_payments = term * payment_schedule;
    const payment = mortgage(amount, annual_rate, number_of_payments, payment_schedule);

    assert.equal(payment, 1290.95);
  });
});
