import assert from 'assert';
import mortgage from '../lib';
import { amortize } from '../lib';

function round(amount) {
  return Math.round(amount * 100) / 100;
}

describe('mortgage', () => {
  it('calculates mortgage payment amounts without interest', () => {
    const amount = 230000; // $
    const annual_rate = 0; // 0%
    const term = 25; // years
    const payment_schedule = 12; // payments per year
    const number_of_payments = term * payment_schedule;
    const payment = mortgage(amount, annual_rate, number_of_payments, payment_schedule);

    assert.equal(payment, round(amount / number_of_payments));
  });

  it('calculate mortgage payment amounts with interest', () => {
    const amount = 230000; // $
    const annual_rate = 0.0464; // 4.64%
    const term = 25; // years
    const payment_schedule = 12; // payments per year
    const number_of_payments = term * payment_schedule;
    const payment = mortgage(amount, annual_rate, number_of_payments, payment_schedule);

    assert.equal(payment, 1290.95);
  });

  it('computes amortization table', () => {
    const amount = 230000;
    const down_payment_percent = 0.15;
    const pmi = amount * 0.03;
    const annual_rate = 0.0479;
    const term = 25;
    const payment_schedule = 12;
    const number_of_payments = term * payment_schedule;
    const annual_appreciation = 0.02;

    const table = amortize(amount, annual_rate, number_of_payments, payment_schedule, down_payment_percent, pmi, annual_appreciation);

    assert.equal(table.length, number_of_payments + 1);
    const { home_value, equity, debt, interest, principal, payment} = table[3];

    assert.equal(home_value, 231151.91);
    assert.equal(equity, 29815.47);
    assert.equal(debt, 201336.44);
    assert.equal(interest, 797.17);
    assert.equal(principal, 355.92);
    assert.equal(payment, 1153.09);
  });

});
