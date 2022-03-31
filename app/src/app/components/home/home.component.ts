import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FoodDetails } from 'src/app/models/food-details';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddFoodDialogComponent } from '../add-food-dialog/add-food-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { FoodService } from 'src/app/services/food.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observer } from 'rxjs';
import { Food } from './models/food';
import { LimitService } from 'src/app/services/limit.service';
import { Limit } from './models/limit';
import { UserService } from 'src/app/services/user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FoodResponse } from 'src/app/models/food-response';
import { DialogDetails } from '../add-food-dialog/models/dialog-details';
import { ReportService } from 'src/app/services/report.service';
import { InvitationDialogComponent } from '../invitation-dialog/invitation-dialog.component';
import { InvitationDetails } from 'src/app/models/invitation-details';
import { InvitationService } from 'src/app/services/invitation.service';
import { InvitationResponse } from 'src/app/models/intivation-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userName: string = '';
  data: Food[] = [];

  isAdmin: boolean = false;

  foodDataSource = new MatTableDataSource<any>();
  limitDataSource = new MatTableDataSource<any>();
  generalReportDataSource = new MatTableDataSource<any>();
  averageReportDataSource = new MatTableDataSource<any>();

  selection: any[] = [];

  constructor(
    private auth: AuthenticationService,
    private dialog: MatDialog,
    private foodService: FoodService,
    private limitService: LimitService,
    private userService: UserService,
    private reportService: ReportService,
    private invitationService: InvitationService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    let userDetails = this.auth.getUserDetailsFromToken();

    if (userDetails) {
      this.userName = userDetails.name;
    }

    this.isAdmin = await this.userService.isAdmin();

    this.foodService.getFood().subscribe(this.handleGetFoodResponse());
  }

  async addFood(): Promise<void> {
    const dialogDetails: DialogDetails = {
      buttonTitle: 'Add food',
    };

    if (this.isAdmin) {
      dialogDetails.users = await this.userService.getUsers();
    }

    this.openDialog(dialogDetails, (food: FoodDetails) => {
      this.foodService.addFood(food).subscribe(this.handleAddFoodResponse());
    });
  }

  editFood(): void {
    const selectedFood = this.selection[0];

    const dialogDetails: DialogDetails = {
      buttonTitle: 'Edit food',
      foodDetails: {
        _id: selectedFood._id,
        name: selectedFood.name,
        calorieValue: selectedFood.calorieValue,
        timestamp: new Date(selectedFood.timestamp),
      },
    };

    this.openDialog(dialogDetails, (food: FoodDetails) => {
      this.foodService.editFood(food).subscribe(this.handleEditFoodResponse());
    });
  }

  deleteFood(): void {
    const ids = this.selection.map((item) => item._id);

    this.foodService
      .deleteFood(ids)
      .subscribe(this.handleDeleteFoodResponse(ids));
  }

  inviteFriend(): void {
    const dialogRef = this.dialog.open(InvitationDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((invitation: InvitationDetails) => {
      if (invitation) {
        this.invitationService
          .sendInvitation(invitation)
          .subscribe(this.handleSendInvitationResponse(invitation.email));
      }
    });
  }

  onSelect(selection: SelectionModel<any>) {
    this.selection = selection.selected;
  }

  onDateChanged(dates: any) {
    this.foodService
      .getFood(dates.startDate, dates.endDate)
      .subscribe(this.handleGetFoodResponse());
  }

  clearSelection() {
    this.selection = [];
  }

  canDelete() {
    return this.selection.length > 0;
  }

  canEdit() {
    return this.selection.length == 1;
  }

  canShowLimitTable() {
    return !this.isAdmin && this.limitDataSource.data.length > 0;
  }

  canShowGeneralReportTable() {
    return this.isAdmin && this.generalReportDataSource.data.length > 0;
  }

  canShowAverageReportTable() {
    return this.isAdmin && this.averageReportDataSource.data.length > 0;
  }

  logout(): void {
    this.auth.logout();
  }

  // #region Private Methods

  private async refreshReportData() {
    const generalReportData: any[] = [];
    const averageReportData: any[] = [];

    const generalReport = await this.reportService.getGeneralReport();
    const averageReport = await this.reportService.getAverageReport();

    generalReportData.push({
      position: 1,
      title: 'Added entries in the last 7 days',
      value: generalReport.currentWeek,
    });

    generalReportData.push({
      position: 2,
      title: 'Added entries the week before last 7 days',
      value: generalReport.previousWeek,
    });

    for (var i = 0; i < averageReport.length; i++) {
      averageReportData.push(averageReport[i]);
      averageReportData[i].position = i + 1;
    }

    this.generalReportDataSource = new MatTableDataSource<any>(
      generalReportData
    );
    this.averageReportDataSource = new MatTableDataSource<any>(
      averageReportData
    );
  }

  private async refreshData(data: Food[]) {
    Food.sort(data);
    Food.setPositions(data);

    this.clearSelection();

    this.data = data;
    this.foodDataSource = new MatTableDataSource<any>(data);

    let limitData = (await this.limitService.getLimitData(data)).map(Limit.map);

    if (!this.isAdmin) {
      this.limitDataSource = new MatTableDataSource<any>(limitData);
    }

    if (this.isAdmin) {
      this.refreshReportData();
    }
  }

  private handleGetFoodResponse(): Partial<Observer<FoodDetails[]>> {
    const refreshData = this.refreshData.bind(this);

    return {
      next: function (response) {
        let data = response.map(Food.map);
        refreshData(data);
      },
      error: this.getError(),
    };
  }

  private handleDeleteFoodResponse(
    ids: string[]
  ): Partial<Observer<FoodResponse>> {
    const snackBar = this.snackBar;
    const refreshData = this.refreshData.bind(this);
    const data = this.data;

    return {
      complete: function () {
        snackBar.open('Food was deleted successfully.', undefined, {
          duration: 3000,
        });
      },
      next: function (response) {
        if (response.success) {
          const newData = data.filter(
            (item) => item._id && !ids.includes(item._id)
          );
          refreshData(newData);
        }
      },
      error: this.getError(),
    };
  }

  private handleSendInvitationResponse(
    email: string
  ): Partial<Observer<InvitationResponse>> {
    const snackBar = this.snackBar;

    return {
      complete: function () {
        snackBar.open(`Invitation was sent to "${email}".`, undefined, {
          duration: 3000,
        });
      },
      error: function (err) {
        snackBar.open(err.error.message, undefined, {
          duration: 3000,
        });
      },
    };
  }

  private handleAddFoodResponse(): Partial<Observer<FoodDetails>> {
    const snackBar = this.snackBar;
    const refreshData = this.refreshData.bind(this);
    const data = this.data;

    return {
      complete: function () {
        snackBar.open('Food was added successfully.', undefined, {
          duration: 3000,
        });
      },
      next: function (newItem) {
        refreshData([...data, Food.map(newItem)]);
      },
      error: this.getError(),
    };
  }

  private handleEditFoodResponse(): Partial<Observer<FoodDetails>> {
    const snackBar = this.snackBar;
    const refreshData = this.refreshData.bind(this);
    const data = this.data;

    return {
      complete: function () {
        snackBar.open('Food was edited successfully.', undefined, {
          duration: 3000,
        });
      },
      next: function (newItem) {
        for (let i = 0; i < data.length; i++) {
          if (data[i]._id === newItem._id) {
            data[i] = Food.map(newItem);
            break;
          }
        }

        refreshData(data);
      },
      error: this.getError(),
    };
  }

  private getError() {
    const snackBar = this.snackBar;

    return function () {
      snackBar.open('Something went wrong.', undefined, {
        duration: 3000,
      });
    };
  }

  private openDialog(
    dialogDetails: DialogDetails,
    callback: (foodDetails: FoodDetails) => void
  ): void {
    const dialogRef = this.dialog.open(AddFoodDialogComponent, {
      width: '500px',
      data: dialogDetails,
    });

    dialogRef.afterClosed().subscribe((food: FoodDetails) => {
      if (food) {
        callback(food);
      }
    });
  }

  // #endregion
}
