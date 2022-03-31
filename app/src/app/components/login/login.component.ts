import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TokenPayload } from 'src/app/models/token-payload';
import { HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
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

  login() {
    if (!this.validate()) {
      return;
    }

    let payload: TokenPayload = {
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value,
    };

    this.auth.login(payload).subscribe(this.handleLoginResponse());
  }

  // #region Private Methods

  private validate() {
    return (
      this.emailFormControl.value !== '' &&
      this.passwordFormControl.value !== ''
    );
  }

  private handleLoginResponse() {
    const router = this.router;
    const snackBar = this.snackBar;

    return {
      complete: function () {
        router.navigateByUrl('/home');
      },
      error: function (err: { status: number }) {
        if (err.status === HttpStatusCode.Unauthorized) {
          snackBar.open('User email or password is wrong.', undefined, {
            duration: 3000,
          });
        }
      },
    };
  }

  // #endregion
}
