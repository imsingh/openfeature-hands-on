import { type H3Event } from "h3";
import { OpenMeteoWeatherSource } from "../lib/weatherSources";

const standardWeatherSource = new OpenMeteoWeatherSource();

export function useWeatherSource(event: H3Event): OpenMeteoWeatherSource {
  // return a custom weather source if one has been injected (i.e. for testing), otherwise return the standard one
  return event.context.weatherSource || standardWeatherSource;
}
