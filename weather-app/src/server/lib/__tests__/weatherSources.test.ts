import { describe, it, expect } from "vitest";
import { mapWeatherCodeToCondition } from "../weatherSources";

describe("mapWeatherCodeToCondition", () => {
  it("should map various weather codes to correct conditions", () => {
    expect(mapWeatherCodeToCondition(0)).toBe("clear");
    expect(mapWeatherCodeToCondition(5)).toBe("partially_cloudy");
    expect(mapWeatherCodeToCondition(45)).toBe("fog");
    expect(mapWeatherCodeToCondition(60)).toBe("rainy");
    expect(mapWeatherCodeToCondition(75)).toBe("snow");
    expect(mapWeatherCodeToCondition(95)).toBe("thunder");
    expect(mapWeatherCodeToCondition(15)).toBe("cloudy");
  });

  it("should default to cloudy for unknown codes", () => {
    expect(mapWeatherCodeToCondition(999)).toBe("cloudy");
    expect(mapWeatherCodeToCondition(-1)).toBe("cloudy");
  });
});
