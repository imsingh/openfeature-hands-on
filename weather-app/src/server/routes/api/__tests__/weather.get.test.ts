import { describe, it, expect, vi } from "vitest";
import { createApp, createRouter, toPlainHandler, type PlainRequest } from "h3";
import weatherHandler from "../weather.get";

import { type Response as WeatherResponse } from "../weather.get";
import { OpenMeteoWeatherSource } from "@/server/lib/weatherSources";
import { InMemoryProvider, OpenFeature } from "@openfeature/server-sdk";

function setupWeatherApp() {
  const app = createApp();
  const router = createRouter();
  router.get("/api/weather", weatherHandler);
  app.use(router);

  return toPlainHandler(app);
}

function setupFeatureFlags(flagName: string, flagValue: boolean) {
  const flagConfig = {
    [flagName]: {
      variants: {
        on: true,
        off: false,
      },
      disabled: false,
      defaultVariant: flagValue ? "on" : "off",
    },
  };
  const provider = new InMemoryProvider(flagConfig);
  // NOTE: we trample any existing provider, and don't clean up after ourselves.
  // in a real-world test suite you'd want to spend more time making sure tests are isolated
  OpenFeature.setProvider(provider);
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

  describe("include-forecast feature flag", () => {
    it("asks weather source for forecast if feature flag is on", async () => {
      const plainHandler = setupWeatherApp();

      const spyWeatherSource = new OpenMeteoWeatherSource();
      const getWeatherSpy = vi.spyOn(
        spyWeatherSource,
        "getWeatherForAllLocations"
      );

      const fakeRequest: PlainRequest = {
        method: "GET",
        path: "/api/weather",
        headers: {},
        context: {
          weatherSource: spyWeatherSource,
        },
      };

      setupFeatureFlags("include-forecast", true);

      await plainHandler(fakeRequest);

      expect(getWeatherSpy).toHaveBeenCalledWith(true);
    });

    it("does not ask weather source for forecast if feature flag is off", async () => {
      const plainHandler = setupWeatherApp();

      const spyWeatherSource = new OpenMeteoWeatherSource();
      const getWeatherSpy = vi.spyOn(
        spyWeatherSource,
        "getWeatherForAllLocations"
      );

      const fakeRequest: PlainRequest = {
        method: "GET",
        path: "/api/weather",
        headers: {},
        context: {
          weatherSource: spyWeatherSource,
        },
      };

      setupFeatureFlags("include-forecast", false);

      await plainHandler(fakeRequest);

      expect(getWeatherSpy).toHaveBeenCalledWith(false);
    });
  });
});
