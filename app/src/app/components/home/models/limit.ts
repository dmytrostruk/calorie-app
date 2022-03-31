import { LimitDetails } from 'src/app/models/limit-details';

export class Limit {
  position: number;
  timestamp: string;
  calorieValue: number;

  static map(limitItem: LimitDetails, index: number): Limit {
    return {
      position: index + 1,
      timestamp: limitItem.timestamp,
      calorieValue: limitItem.calorieValue
    };
  }
}
