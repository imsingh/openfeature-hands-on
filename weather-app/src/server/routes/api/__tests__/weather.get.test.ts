import { describe, it, expect } from "vitest";
import { createApp, createRouter, toPlainHandler, type PlainRequest } from "h3";
import weatherHandler from "../weather.get";

import { type Response as WeatherResponse } from "../weather.get";

function setupWeatherApp() {
  const app = createApp();
  const router = createRouter();
  router.get("/api/weather", weatherHandler);
  app.use(router);

  return toPlainHandler(app);
}

describe("weather.get endpoint", () => {
  it("should return weather data from weather source", async () => {
    const plainHandler = setupWeatherApp();

    const fakeWeatherData = [{ dummy: "weather data" }];
    const fakeWeatherSource = {
      getWeatherForAllLocations: () => {
        return fakeWeatherData;
      },
    };

    const fakeRequest: PlainRequest = {
      method: "GET",
      path: "/api/weather",
      headers: {},
      context: { weatherSource: fakeWeatherSource },
    };

    const response = await plainHandler(fakeRequest);
    const result = JSON.parse(response.body as string) as WeatherResponse;

    expect(result).toHaveProperty("lastUpdated");
    expect(result).toHaveProperty("locations");
    expect(result.locations).toEqual(fakeWeatherData);
  });
});
