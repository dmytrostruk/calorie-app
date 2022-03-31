import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationResponse } from 'src/app/models/intivation-response';
import { TokenPayload } from 'src/app/models/token-payload';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { InvitationService } from 'src/app/services/invitation.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css'],
})
export class InvitationComponent implements OnInit {
  invitation: InvitationResponse;
  code: string;

  nameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invitationService: InvitationService,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.code = params['code'];

      this.invitation = await this.invitationService.validateInvitationCode(
        this.code
      );
    });
  }

  register() {
    if (!this.validate()) {
      return;
    }

    let payload: TokenPayload = {
      email: this.invitation.email,
      code: this.code,
      password: this.passwordFormControl.value,
      name: this.nameFormControl.value,
    };

    this.auth.register(payload).subscribe(this.handleRegisterResponse());
  }

  // #region Private Methods

  private validate() {
    return (
      this.passwordFormControl.value !== '' &&
      this.nameFormControl.value !== ''
    );
  }

  private handleRegisterResponse() {
    const router = this.router;

    return {
      complete: function () {
        router.navigateByUrl('/home');
      }
    };
  }

  // #endregion
}
