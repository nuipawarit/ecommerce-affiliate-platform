import { startPriceRefreshJob } from "./price-refresh.job";

export function initializeJobs() {
  console.log("[Jobs] Initializing background jobs...");

  startPriceRefreshJob();

  console.log("[Jobs] All background jobs initialized successfully");
}
