import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpStatusCode } from '@angular/common/http';
import { TokenPayload } from 'src/app/models/token-payload';
import { authentication } from 'src/app/constants/authentication';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  navigate(route: String) {
    this.router.navigate([route]);
  }

  register() {
    if (!this.validate()) {
      return;
    }

    let payload: TokenPayload = {
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value,
      name: this.nameFormControl.value
    };

    this.auth.register(payload).subscribe(this.handleRegisterResponse());
  }

  // #region Private Methods

  private validate() {
    return (
      this.emailFormControl.value !== '' &&
      this.passwordFormControl.value !== '' &&
      this.nameFormControl.value !== ''
    );
  }

  private handleRegisterResponse() {
    const router = this.router;
    const snackBar = this.snackBar;

    return {
      complete: function () {
        router.navigateByUrl('/home');
      },
      error: function (err: any) {
        if(err.error.code === authentication.USER_EXISTS_CODE) {
          snackBar.open('User with provided email already exists.', undefined, {
            duration: 3000,
          });
        }
      },
    };
  }

  // #endregion
}
