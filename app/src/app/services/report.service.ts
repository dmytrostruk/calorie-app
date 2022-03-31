import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AverageReport } from '../models/average-report';
import { GeneralReport } from '../models/general-report';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpService: HttpService) { }

  public async getGeneralReport(): Promise<GeneralReport> {
    const report = this.httpService.get<GeneralReport>('/get-general-report');
    return await lastValueFrom(report);
  }

  public async getAverageReport(): Promise<AverageReport[]> {
    const report = this.httpService.get<AverageReport[]>('/get-average-report');
    return await lastValueFrom(report);
  }
}
