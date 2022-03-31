import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-limit-table',
  templateUrl: './limit-table.component.html',
  styleUrls: ['./limit-table.component.css'],
})
export class LimitTableComponent implements OnInit {
  @Input() dataSource = new MatTableDataSource<any>();
  @ViewChild('limitPaginator') limitPaginator: MatPaginator;

  displayedColumns: string[] = ['position', 'timestamp', 'calorieValue'];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.dataSource.paginator = this.limitPaginator;
    }
  }
}
