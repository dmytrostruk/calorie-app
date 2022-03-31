import { FoodDetails } from "src/app/models/food-details";
import { UserDetails } from "src/app/models/user-details";

export interface DialogDetails {
  buttonTitle: string;
  foodDetails?: FoodDetails,
  users?: UserDetails[]
}