import { NavigationRepository } from "@/domain/repositories/NavigationRepository";
import { NavigationModel, NavigationSchema } from "@/domain/models/Navigation";
import { HomePageRepository } from "@/domain/repositories/HomePageRepository";
import { HomePageModel, HomePageSchema } from "@/domain/models/HomePage";
import mockNavData from "./data/navigation.json";
import mockHomeData from "./data/home-page.json";

export class MockCMSAdapter
  implements NavigationRepository, HomePageRepository
{
  async getNavigation(): Promise<NavigationModel> {
    // 1. Simulate network / external CMS latency
    await new Promise((resolve) => setTimeout(resolve, 30));

    // 2. Validate payload at the boundary via Zod schema (Anti-Corruption Layer)
    return NavigationSchema.parse(mockNavData);
  }

  async getHomePage(): Promise<HomePageModel> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return HomePageSchema.parse(mockHomeData);
  }
}
