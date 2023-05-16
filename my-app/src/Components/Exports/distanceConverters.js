//Meters to miles helper function
export function toMiles(meters)
{
    return parseInt(meters) * 0.000621371;
}

//Miles to meters helper function
export function toMeters(miles)
{
  return parseInt(Math.floor(parseInt(miles) * 1609.34));
}