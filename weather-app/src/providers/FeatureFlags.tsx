import React from "react";
import {
  OpenFeatureProvider,
  OpenFeature,
  useContextMutator,
  type HookContext,
  type JsonValue,
  type EvaluationDetails,
  type Hook,
} from "@openfeature/react-sdk";
import { FliptWebProvider } from "@openfeature/flipt-web-provider";
import { useAuth } from "./AuthContext";
import { analytics } from "@/lib/analytics";

class AnalyticsHook implements Hook {
  public after(
    _hookContext: Readonly<HookContext<JsonValue>>,
    evaluationDetails: EvaluationDetails<JsonValue>
  ): void {
    analytics.track("Experiment Viewed", {
      experimentId: evaluationDetails.flagKey,
      variantId: evaluationDetails.variant || String(evaluationDetails.value),
      openFeatureReason: evaluationDetails.reason,
      openFeatureErrorCode: evaluationDetails.errorCode,
    });
  }
}

const fliptProvider = new FliptWebProvider("default", {
  url: "http://localhost:8002",
});

OpenFeature.setProvider(fliptProvider);
OpenFeature.addHooks(new AnalyticsHook());

export function FeatureFlagsProvider({ children }: React.PropsWithChildren) {
  const { user } = useAuth();
  const { setContext } = useContextMutator();
  if (user) {
    setContext({
      targetingKey: user.id,
      orgId: user.org.id,
    });
  } else {
    setContext({
      targetingKey: "anonymous",
      orgId: null,
    });
  }
  return <OpenFeatureProvider>{children}</OpenFeatureProvider>;
}
