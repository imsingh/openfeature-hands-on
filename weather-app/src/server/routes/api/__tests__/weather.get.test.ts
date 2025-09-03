import { describe, it, expect } from "vitest";
import { createApp, createRouter, toPlainHandler } from "h3";
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
  it("should return weather data with lastUpdated timestamp", async () => {
    const plainHandler = setupWeatherApp();

    const fakeEvent = {
      method: "GET",
      path: "/api/weather",
      headers: {},
    };

    const response = await plainHandler(fakeEvent);
    const result = JSON.parse(response.body as string) as WeatherResponse;

    expect(result).toHaveProperty("locations");
    expect(result).toHaveProperty("lastUpdated");
    expect(Array.isArray(result.locations)).toBe(true);
    expect(result.locations.length).toBeGreaterThan(0);
    expect(result.lastUpdated).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );

    result.locations.forEach((location) => {
      expect(location).toHaveProperty("city");
      expect(location).toHaveProperty("temperatureC");
      expect(location).toHaveProperty("condition");
      expect(location).toHaveProperty("forecast");
      expect(typeof location.city).toBe("string");
      expect(typeof location.temperatureC).toBe("number");
      expect(typeof location.condition).toBe("string");
    });
  });
});
