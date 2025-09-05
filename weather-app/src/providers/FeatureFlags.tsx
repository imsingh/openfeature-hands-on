import React from "react";
import {
  OpenFeatureProvider,
  OpenFeature,
  useContextMutator,
} from "@openfeature/react-sdk";
import { FliptWebProvider } from "@openfeature/flipt-web-provider";
import { useAuth } from "./AuthContext";

const fliptProvider = new FliptWebProvider("default", {
  url: "http://localhost:8002",
});

OpenFeature.setProvider(fliptProvider);

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
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
