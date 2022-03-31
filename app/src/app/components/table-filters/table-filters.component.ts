import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.css'],
})
export class TableFiltersComponent implements OnInit {
  startFormControl: FormControl = new FormControl('');
  endFormControl: FormControl = new FormControl('');

  @Output() dateChanged = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  triggerChange(): void {
    this.startFormControl.setErrors(null);

    const startDate = new Date(this.startFormControl.value);
    const endDate = new Date(this.endFormControl.value);

    if (startDate > endDate) {
      this.startFormControl.setErrors({
        ...(this.startFormControl.errors || {}),
        greater: 'Start Date cannot be greater than End Date',
      });
    }

    if (this.startFormControl.valid) {
      this.dateChanged.emit({
        startDate: this.startFormControl.value,
        endDate: this.endFormControl.value,
      });
    }
  }
}
