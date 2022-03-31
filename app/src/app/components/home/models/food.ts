import { FoodDetails } from 'src/app/models/food-details';

export class Food {
  _id?: string;
  position: number;
  name: string;
  calorieValue: number;
  timestamp: string;
  userName: string;
  userEmail: string;

  static map(foodItem: FoodDetails): Food {
    return {
      _id: foodItem._id,
      position: 0,
      name: foodItem.name,
      calorieValue: foodItem.calorieValue,
      timestamp: new Date(foodItem.timestamp).toLocaleString(),
      userName: foodItem.user.name,
      userEmail: foodItem.user.email,
    };
  }

  static setPositions(food: Food[]): void {
    for (var i = 0; i < food.length; i++) {
      food[i].position = i + 1;
    }
  }

  static sort(food: Food[]): void {
    food.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}
