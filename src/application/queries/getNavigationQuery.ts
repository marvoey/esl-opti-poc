import { NavigationModel } from "@/domain/models/Navigation";
import { getNavigationRepository } from "@/infrastructure/cms/cms-factory";

/**
 * Pure Application Query: Fetches navigation data via the configured CMS port.
 * Can be called directly by React Server Components.
 */
export async function getNavigationQuery(): Promise<NavigationModel> {
  const repository = getNavigationRepository();
  return repository.getNavigation();
}
