export const PHONE_PREFIX = '555-';

export const phoneDigits = (value = '') => {
  const rawValue = String(value);
  const digits = rawValue.replace(/\D/g, '');
  const hasPrefix = digits.startsWith('555') && (rawValue.includes('-') || digits.length > 4);
  return (hasPrefix ? digits.slice(3) : digits).slice(0, 4);
};

export const formatPhoneNumber = (value = '') => `${PHONE_PREFIX}${phoneDigits(value)}`;

export const isPhoneSuffixValid = (value = '') => /^\d{4}$/.test(phoneDigits(value));
