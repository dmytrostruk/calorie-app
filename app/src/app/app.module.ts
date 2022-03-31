// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

// Services
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { FoodService } from './services/food.service';
import { HttpService } from './services/http.service';
import { LimitService } from './services/limit.service';
import { UserService } from './services/user.service';
import { ReportService } from './services/report.service';
import { InvitationService } from './services/invitation.service';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddFoodDialogComponent } from './components/add-food-dialog/add-food-dialog.component';
import { FoodTableComponent } from './components/food-table/food-table.component';
import { LimitTableComponent } from './components/limit-table/limit-table.component';
import { GeneralReportTableComponent } from './components/general-report-table/general-report-table.component';
import { AverageReportTableComponent } from './components/average-report-table/average-report-table.component';
import { TableFiltersComponent } from './components/table-filters/table-filters.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { InvitationDialogComponent } from './components/invitation-dialog/invitation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AddFoodDialogComponent,
    FoodTableComponent,
    LimitTableComponent,
    GeneralReportTableComponent,
    AverageReportTableComponent,
    TableFiltersComponent,
    InvitationComponent,
    InvitationDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    FoodService,
    HttpService,
    LimitService,
    UserService,
    ReportService,
    InvitationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
