import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-general-report-table',
  templateUrl: './general-report-table.component.html',
  styleUrls: ['./general-report-table.component.css']
})
export class GeneralReportTableComponent implements OnInit {
  @Input() dataSource = new MatTableDataSource<any>();
  @ViewChild('generalReportPaginator') generalReportPaginator: MatPaginator;

  displayedColumns: string[] = ['position', 'title', 'value'];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.dataSource.paginator = this.generalReportPaginator;
    }
  }
}
