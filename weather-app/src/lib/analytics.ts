import { jitsuAnalytics } from "@jitsu/js";

export const JITSU_HOST = "http://localhost:8080";
export const JITSU_WRITE_KEY = "B6Vj2LbMYf3WNOm7aXpH0Ed5zgdakzMP:kOc*Jvh";

export const analytics = jitsuAnalytics({
  host: JITSU_HOST,
  writeKey: JITSU_WRITE_KEY,
});
