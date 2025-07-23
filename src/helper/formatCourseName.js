const toCamelCase = (input) => {
  return input
    .split(" ")
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0
        ? lower
        : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
};

module.exports = toCamelCase;
