import { Injectable } from '@angular/core';
import { Food } from '../components/home/models/food';
import { LimitDetails } from '../models/limit-details';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LimitService {
  constructor(private userService: UserService) {}

  public async getLimitData(food: Food[]): Promise<LimitDetails[]> {
    const userDetails = await this.userService.getUserDetails();
    const dailyLimit = userDetails.dailyCalorieLimit;

    let result: LimitDetails[] = [];
    let data: { [key: string]: number } = {};

    food.forEach((item) => {
      let key = this.generateTimestampKey(item.timestamp);
      data[key] = data[key] ? data[key] + item.calorieValue : item.calorieValue;
    });

    Object.keys(data).forEach((key) => {
      if (data[key] > dailyLimit) {
        result.push({ timestamp: key, calorieValue: data[key] });
      }
    });

    return result;
  }

  // #region Private Methods

  private generateTimestampKey(timestamp: string): string {
    return timestamp.split(',')[0];
  }

  // #endregion
}
