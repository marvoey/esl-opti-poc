import { HomePageModel } from "@/domain/models/HomePage";
import { getHomePageRepository } from "@/infrastructure/cms/cms-factory";

/**
 * Pure Application Query: Fetches Home Page content via the configured CMS port.
 * Can be called directly by React Server Components.
 */
export async function getHomePageQuery(): Promise<HomePageModel> {
  const repository = getHomePageRepository();
  return repository.getHomePage();
}
