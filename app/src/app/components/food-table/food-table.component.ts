import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-food-table',
  templateUrl: './food-table.component.html',
  styleUrls: ['./food-table.component.css'],
})
export class FoodTableComponent implements OnInit {
  @Input() dataSource = new MatTableDataSource<any>();
  @Output() selectEvent = new EventEmitter<any>();
  @ViewChild('foodPaginator') foodPaginator: MatPaginator;

  isAdmin: boolean = false;

  selection = new SelectionModel<any>(true, []);

  displayedColumns: string[] = [
    'select',
    'position',
    'name',
    'calorieValue',
    'timestamp',
  ];

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    this.isAdmin = await this.userService.isAdmin();

    if (this.isAdmin) {
      this.displayedColumns.push('userName');
      this.displayedColumns.push('userEmail');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.selection.clear();
      this.dataSource.paginator = this.foodPaginator;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  toogle(row: any) {
    this.selection.toggle(row);
    this.selectEvent.emit(this.selection);
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));

    this.selectEvent.emit(this.selection);
  }
}
