import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitTableComponent } from './limit-table.component';

describe('LimitTableComponent', () => {
  let component: LimitTableComponent;
  let fixture: ComponentFixture<LimitTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
