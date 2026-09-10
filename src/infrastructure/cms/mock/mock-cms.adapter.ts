import { NavigationRepository } from "@/domain/repositories/NavigationRepository";
import { NavigationModel, NavigationSchema } from "@/domain/models/Navigation";
import mockNavData from "./data/navigation.json";

export class MockCMSAdapter implements NavigationRepository {
  async getNavigation(): Promise<NavigationModel> {
    // 1. Simulate network / external CMS latency
    await new Promise((resolve) => setTimeout(resolve, 30));

    // 2. Validate payload at the boundary via Zod schema (Anti-Corruption Layer)
    return NavigationSchema.parse(mockNavData);
  }
}
