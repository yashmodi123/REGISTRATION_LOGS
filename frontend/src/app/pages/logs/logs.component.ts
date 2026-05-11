import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService, Log } from '../../core/services/log.service';
import { LogDetailDialogComponent } from './log-detail-dialog/log-detail-dialog.component';

@Component({
  selector: 'app-logs',
  standalone: false,
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  cols = ['id', 'type', 'email', 'message', 'details', 'created_at'];
  dataSource = new MatTableDataSource<Log>();
  allLogs: Log[] = [];
  loading = true;

  filters: { email?: string; type?: string; startDate?: any; endDate?: any } = {};

  get usageCount() { return this.allLogs.filter(l => l.type === 'USAGE').length; }
  get errorCount() { return this.allLogs.filter(l => l.type === 'ERROR').length; }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private logSvc: LogService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    // Pre-fill email from route queryParam (redirect from registrations)
    this.route.queryParams.subscribe(params => {
      if (params['email']) this.filters.email = params['email'];
      this.load();
    });
  }

  load() {
    this.loading = true;
    const f: any = {};
    if (this.filters.email)     f.email     = this.filters.email;
    if (this.filters.type)      f.type      = this.filters.type;
    if (this.filters.startDate) f.startDate = new Date(this.filters.startDate).toISOString();
    if (this.filters.endDate)   f.endDate   = new Date(this.filters.endDate).toISOString();

    this.logSvc.getLogs(f).subscribe({
      next: (res) => {
        this.allLogs = res.data;
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        this.snack.open(err?.error?.error || 'Failed to load logs.', 'OK', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applySearch(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  clearFilters() {
    this.filters = {};
    this.load();
  }

  viewDetails(log: Log) {
    this.dialog.open(LogDetailDialogComponent, {
      data: log,
      width: '520px',
      maxHeight: '80vh'
    });
  }
}
