import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageReportTableComponent } from './average-report-table.component';

describe('AverageReportTableComponent', () => {
  let component: AverageReportTableComponent;
  let fixture: ComponentFixture<AverageReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AverageReportTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
