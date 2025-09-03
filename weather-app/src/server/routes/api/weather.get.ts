import { defineEventHandler } from "h3";
import { OpenMeteoWeatherSource } from "../../lib/weatherSources";
import { useFeatureFlags } from "../../utils/featureFlags";

const openMeteoWeather = new OpenMeteoWeatherSource();

export default defineEventHandler(async (event) => {
  const flags = useFeatureFlags(event);
  const result = await flags.getBooleanDetails("include-forecast", false);
  console.log({ result });
  const includeForecast = result.value;

  const locations = await openMeteoWeather.getWeatherForAllLocations(
    includeForecast
  );

  return {
    locations,
    lastUpdated: new Date().toISOString(),
  };
});
