import { HomePageModel } from "../models/HomePage";

export interface HomePageRepository {
  getHomePage(): Promise<HomePageModel>;
}
