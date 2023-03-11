// This is a helper function that will be used to generate a random id
// Helper function for creating random turkish citizen id
const getRandomDigit = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * It generates a random 11 digit number, then checks if the last two digits are correct, and if they
 * are, it returns the number
 * @returns A random Turkish ID number.
 */
export const randomId = () => {
  var digits = [];

  digits[0] = getRandomDigit(1, 9);
  for (let i = 1; i < 9; i++) {
    digits[i] = getRandomDigit(0, 9);
  }

  digits[9] =
    ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 -
      (digits[1] + digits[3] + digits[5] + digits[7])) %
    10;
  digits[10] =
    (digits[0] +
      digits[1] +
      digits[2] +
      digits[3] +
      digits[4] +
      digits[5] +
      digits[6] +
      digits[7] +
      digits[8] +
      digits[9]) %
    10;

  const tcNo =
    digits[0].toString() +
    digits[1].toString() +
    digits[2].toString() +
    digits[3].toString() +
    digits[4].toString() +
    digits[5].toString() +
    digits[6].toString() +
    digits[7].toString() +
    digits[8].toString() +
    digits[9].toString() +
    digits[10].toString();

  return tcNo;
};
