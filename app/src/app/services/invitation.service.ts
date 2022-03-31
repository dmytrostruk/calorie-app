import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { InvitationResponse } from '../models/intivation-response';
import { InvitationDetails } from '../models/invitation-details';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(private httpService: HttpService) { }

  async validateInvitationCode(code: string): Promise<InvitationResponse> {
    const url = `/validate-invitation-code?code=${code}`;
    const validation = this.httpService.get<InvitationResponse>(url);

    return await lastValueFrom(validation);
  }

  sendInvitation(invitation: InvitationDetails): Observable<InvitationResponse> {
    return this.httpService.post<InvitationResponse>("/send-invitation", invitation);
  }
}
