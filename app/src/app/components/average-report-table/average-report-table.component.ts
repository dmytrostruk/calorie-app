import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-average-report-table',
  templateUrl: './average-report-table.component.html',
  styleUrls: ['./average-report-table.component.css'],
})
export class AverageReportTableComponent implements OnInit {
  @Input() dataSource = new MatTableDataSource<any>();
  @ViewChild('averageReportPaginator') averageReportPaginator: MatPaginator;

  displayedColumns: string[] = ['position', 'name', 'email', 'averageValue'];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.dataSource.paginator = this.averageReportPaginator;
    }
  }
}
