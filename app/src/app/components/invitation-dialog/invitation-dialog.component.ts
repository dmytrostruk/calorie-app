import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InvitationDetails } from 'src/app/models/invitation-details';

@Component({
  selector: 'app-invitation-dialog',
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.css'],
})
export class InvitationDialogComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(private dialogRef: MatDialogRef<InvitationDialogComponent>) {}

  ngOnInit(): void {}

  invite() {
    if (!this.validate()) {
      return;
    }

    this.dialogRef.close(this.getInvitationDetails());
  }

  close(): void {
    this.dialogRef.close();
  }

  // #region Private Methods

  private getInvitationDetails(): InvitationDetails {
    let invitationDetails: InvitationDetails = {
      email: this.emailFormControl.value,
      name: this.nameFormControl.value
    };

    return invitationDetails;
  }

  private validate(): boolean {
    const controls = [
      this.nameFormControl,
      this.emailFormControl
    ];

    let result = true;

    controls.forEach((control) => {
      control.markAsTouched();
      result = result && control.valid;
    });

    return result;
  }

  // #endregion
}
