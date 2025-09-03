import { defineEventHandler } from "h3";
import { type WeatherData } from "../../lib/weatherSources";
import { useFeatureFlags } from "../../utils/featureFlags";
import { useWeatherSource } from "../../utils/weatherSource";
export interface Response {
  locations: WeatherData[];
  lastUpdated: string;
}

export default defineEventHandler(async (event): Promise<Response> => {
  const weatherSource = useWeatherSource(event);
  const flags = useFeatureFlags(event);
  const includeForecast = await flags.getBooleanValue(
    "include-forecast",
    false
  );

  const locations = await weatherSource.getWeatherForAllLocations(
    includeForecast
  );

  return {
    locations,
    lastUpdated: new Date().toISOString(),
  };
});
