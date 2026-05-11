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
  filters: { email?: string; type?: string; startDate?: string; endDate?: string } = {};

  get usageCount() { return this.allLogs.filter(l => l.type === 'USAGE').length; }
  get errorCount() { return this.allLogs.filter(l => l.type === 'ERROR').length; }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private logSvc: LogService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {
    this.resetToDefaultRange();
  }

  private resetToDefaultRange() {
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    this.filters.startDate = this.formatForInput(lastWeek);
    this.filters.endDate   = this.formatForInput(now);
  }

  onRangeChange(range: string) {
    if (range === 'custom') return;
    
    const now = new Date();
    const start = new Date();

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case '24h':
        start.setHours(now.getHours() - 24);
        break;
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '30d':
        start.setDate(now.getDate() - 30);
        break;
    }

    this.filters.startDate = this.formatForInput(start);
    this.filters.endDate   = this.formatForInput(now);
    this.load();
  }

  private formatForInput(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' +
           pad(date.getMonth() + 1) + '-' +
           pad(date.getDate()) + 'T' +
           pad(date.getHours()) + ':' +
           pad(date.getMinutes());
  }

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
    if (this.filters.email) f.email = this.filters.email;
    if (this.filters.type)  f.type  = this.filters.type;

    if (this.filters.startDate) {
      f.startDate = new Date(this.filters.startDate).toISOString();
    }
    if (this.filters.endDate) {
      f.endDate = new Date(this.filters.endDate).toISOString();
    }

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
    this.resetToDefaultRange();
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
