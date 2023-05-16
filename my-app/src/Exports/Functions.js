//Meters to miles helper function
export function toMiles(meters) {
    return parseInt(meters) * 0.000621371;
}

//Miles to meters helper function
export function toMeters(miles) {
  return parseInt(Math.floor(parseInt(miles) * 1609.34));
}

export function toTitleCase(phrase) {
  return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

export function formatNumber(number) {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

  if (number >= 1000) {
    return (number/1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return number;
}