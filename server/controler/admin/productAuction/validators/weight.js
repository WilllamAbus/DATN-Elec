const validateWeight = (weight) => {
  return typeof weight === 'number' && !isNaN(weight) && weight > 0 && weight <= 1000;
};

const validateWeightInput = (weightInput) => {
  if (typeof weightInput === 'string') {
    if (isNaN(weightInput) || weightInput.trim() === '') {
      return false;
    }
    const weightAsNumber = parseFloat(weightInput);
    return weightAsNumber > 0 && weightAsNumber <= 1000;
  }

  return validateWeight(weightInput);
};

module.exports = {
  validateWeight,
  validateWeightInput,
};
