interface IdentifyTraits {
  [key: string]: string | number | boolean;
}

class FauxAnalytics {
  private currentUserId?: string;
  private currentTraits: IdentifyTraits = {};

  track(event: string, properties?: Record<string, unknown>): void {
    const mergedProperties = {
      ...this.currentTraits,
      ...properties,
    };

    this.logEventToConsole(event, mergedProperties);
  }

  identify(userId: string, traits?: IdentifyTraits): void {
    this.currentUserId = userId;
    if (traits) {
      this.currentTraits = { ...this.currentTraits, ...traits };
    }
  }

  reset(): void {
    this.currentUserId = undefined;
    this.currentTraits = {};
  }

  private logEventToConsole(
    event: string,
    properties: Record<string, unknown>
  ): void {
    let message = `%c📊 [Faux Analytics] Track: %c"${event}"%c`;
    const styles = [
      "color: #4CAF50; font-weight: bold;",
      "color: #FF6B35; font-weight: bold;",
      "color: inherit;",
    ];

    if (this.currentUserId) {
      message += ` | User ID: ${this.currentUserId}`;
    }

    console.log(message, ...styles, properties);
  }
}

export const analytics = new FauxAnalytics();
