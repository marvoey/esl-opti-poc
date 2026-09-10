import { NavigationModel } from "../models/Navigation";

export interface NavigationRepository {
  getNavigation(): Promise<NavigationModel>;
}
