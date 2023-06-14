const useCapitalizeFirstletter = (text: string): string => {
  return text.replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
};

const useSlugText = (text: string[]): string => {
  const value = text.join(' ');

  return value
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-'); // separator
};

export { useCapitalizeFirstletter, useSlugText };
