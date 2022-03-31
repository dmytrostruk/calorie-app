import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FoodDetails } from '../models/food-details';
import { FoodResponse } from '../models/food-response';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  
  constructor(private httpService: HttpService) {}

  public addFood(food: FoodDetails): Observable<FoodDetails> {
    return this.httpService.post('/add-food', food);
  }

  public editFood(food: FoodDetails): Observable<FoodDetails> {
    return this.httpService.patch('/update-food', food);
  }

  public getFood(startDate: string = '', endDate: string = ''): Observable<FoodDetails[]> {
    return this.httpService.get(`/get-food?startDate=${startDate}&endDate=${endDate}`);
  }

  public deleteFood(ids: string[]): Observable<FoodResponse> {
    return this.httpService.post('/delete-food', {ids: ids});
  }
}
