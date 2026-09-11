import { NavigationRepository } from "@/domain/repositories/NavigationRepository";
import { HomePageRepository } from "@/domain/repositories/HomePageRepository";
import { MockCMSAdapter } from "./mock/mock-cms.adapter";

export function getNavigationRepository(): NavigationRepository {
  const cmsProvider = process.env.CMS_PROVIDER || "mock";

  switch (cmsProvider) {
    case "cms":
      throw new Error("CMSAdapter not yet initialized. Configure credentials first.");
    case "mock":
    default:
      return new MockCMSAdapter();
  }
}

export function getHomePageRepository(): HomePageRepository {
  const cmsProvider = process.env.CMS_PROVIDER || "mock";

  switch (cmsProvider) {
    case "cms":
      throw new Error("CMSAdapter not yet initialized. Configure credentials first.");
    case "mock":
    default:
      return new MockCMSAdapter();
  }
}
