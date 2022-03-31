import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FoodDetails } from 'src/app/models/food-details';
import { UserDetails } from 'src/app/models/user-details';
import { UserService } from 'src/app/services/user.service';
import { DialogDetails } from './models/dialog-details';
import { UserOption } from './models/user-option';

@Component({
  selector: 'app-add-food-dialog',
  templateUrl: './add-food-dialog.component.html',
  styleUrls: ['./add-food-dialog.component.css'],
})
export class AddFoodDialogComponent implements OnInit {
  maxDate: Date = new Date();
  buttonTitle: string = '';

  users: UserOption[] = [];

  nameFormControl = new FormControl('', [Validators.required]);
  userFormControl = new FormControl('', Validators.required);
  dateTimeFormControl = new FormControl('', Validators.required);
  calorieFormControl = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);

  constructor(
    private dialogRef: MatDialogRef<AddFoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogDetails
  ) {}

  ngOnInit(): void {
    this.buttonTitle = this.data.buttonTitle;

    if (this.data.foodDetails) {
      this.nameFormControl.setValue(this.data.foodDetails.name);
      this.calorieFormControl.setValue(this.data.foodDetails.calorieValue);
      this.dateTimeFormControl.setValue(
        this.getDateTimeInputValue(this.data.foodDetails.timestamp)
      );
    }

    if (this.data.users) {
      this.users = this.data.users.map(this.getUserOption);
    }
  }

  addFood(): void {
    if (!this.validate()) {
      return;
    }

    this.dialogRef.close(this.getFoodDetails());
  }

  canChooseUser(): boolean {
    return this.users && this.users.length > 0;
  }

  close(): void {
    this.dialogRef.close();
  }

  // #region Private Methods

  private getUserOption(user: UserDetails): UserOption {
    return {
      value: user._id,
      viewValue: user.name,
    };
  }

  private getDateTimeInputValue(dateTime: Date): string {
    dateTime.setMinutes(dateTime.getMinutes() - dateTime.getTimezoneOffset());

    return dateTime.toISOString().slice(0, 16);
  }

  private validate(): boolean {
    const controls = [
      this.nameFormControl,
      this.calorieFormControl,
      this.dateTimeFormControl,
    ];

    if (this.canChooseUser()) {
      controls.push(this.userFormControl);
    }

    let result = true;

    const isDateInFuture =
      this.dateTimeFormControl.value &&
      new Date(this.dateTimeFormControl.value) > new Date();

    if (isDateInFuture) {
      this.dateTimeFormControl.setErrors({
        ...(this.dateTimeFormControl.errors || {}),
        max: 'Date and Time cannot be set in the future',
      });
    }

    controls.forEach((control) => {
      control.markAsTouched();
      result = result && control.valid;
    });

    return result;
  }

  private getFoodDetails(): FoodDetails {
    let foodDetails: FoodDetails = {
      name: this.nameFormControl.value,
      calorieValue: this.calorieFormControl.value,
      timestamp: this.dateTimeFormControl.value,
    };

    if (this.data.foodDetails) {
      foodDetails._id = this.data.foodDetails._id;
    }

    if (this.canChooseUser()) {
      foodDetails.user = { _id: this.userFormControl.value };
    }

    return foodDetails;
  }

  // #endregion
}
