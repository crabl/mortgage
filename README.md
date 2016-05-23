# mortgage
> Calculating mortgages the Canadian Way™

## Installation

```sh
$ npm install --save crabl/mortgage
```

## Usage

```js
import mortgage from 'mortgage';

const amount = 230000; // $
const annual_rate = 0.0464; // 4.64%
const term = 25; // years
const payment_schedule = 12; // payments per year
const number_of_payments = term * payment_schedule;
const payment = mortgage(amount, annual_rate, number_of_payments, payment_schedule);
```
## License

MIT © [Chris Rabl]()
