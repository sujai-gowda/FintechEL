export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

export const formatINR = (amount) =>
  `${CURRENCY_SYMBOL}${Number(amount || 0).toLocaleString('en-IN')}`;
