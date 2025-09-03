import { type H3Event } from "h3";
import {
  OpenFeature,
  type Client,
  type EvaluationContext,
} from "@openfeature/server-sdk";
import { useAuth } from "./auth";

export function useFeatureFlags(event: H3Event): Client {
  const client = OpenFeature.getClient();
  const currentUser = useAuth(event);
  const evalContext: EvaluationContext = currentUser
    ? {
        targetingKey: currentUser.id,
        orgId: currentUser.orgId,
      }
    : {};
  client.setContext(evalContext);
  return client;
}
