export const PHONE_PREFIX = '555-';

export const phoneDigits = (value = '') => {
  const digits = String(value).replace(/\D/g, '');
  return (digits.startsWith('555') ? digits.slice(3) : digits).slice(0, 4);
};

export const formatPhoneNumber = (value = '') => `${PHONE_PREFIX}${phoneDigits(value)}`;

export const isPhoneSuffixValid = (value = '') => /^\d{4}$/.test(phoneDigits(value));
