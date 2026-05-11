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
  cols = ['id', 'type', 'machine_number', 'company_name', 'email', 'message', 'details', 'created_at'];
  dataSource = new MatTableDataSource<Log>();
  allLogs: Log[] = [];
  loading = true;
  filters: { email?: string; type?: string; startDate?: Date; startTime?: string; endDate?: Date; endTime?: string } = {};

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
    
    this.filters.startDate = lastWeek;
    this.filters.startTime = this.formatTime(lastWeek);
    this.filters.endDate   = now;
    this.filters.endTime   = this.formatTime(now);
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

    this.filters.startDate = start;
    this.filters.startTime = this.formatTime(start);
    this.filters.endDate   = now;
    this.filters.endTime   = this.formatTime(now);
    this.load();
  }

  private formatTime(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return pad(date.getHours()) + ':' + pad(date.getMinutes());
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
      const d = new Date(this.filters.startDate);
      if (this.filters.startTime) {
        const [h, m] = this.filters.startTime.split(':');
        d.setHours(+h, +m, 0);
      }
      f.startDate = d.toISOString();
    }
    if (this.filters.endDate) {
      const d = new Date(this.filters.endDate);
      if (this.filters.endTime) {
        const [h, m] = this.filters.endTime.split(':');
        d.setHours(+h, +m, 59);
      }
      f.endDate = d.toISOString();
    }

    this.logSvc.getLogs(f).subscribe({
      next: (res) => {
        const data = res?.data || [];
        this.allLogs = data;
        this.dataSource.data = data;
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

  downloadCSV() {
    const data = this.dataSource.data || [];
    if (data.length === 0) {
      this.snack.open('No data to export.', 'OK', { duration: 3000 });
      return;
    }

    const headers = ['ID', 'Type', 'Machine #', 'Company', 'Email', 'Message', 'Created At'];
    const rows = data.map(l => [
      l.id,
      l.type,
      l.registration?.machine_number || '',
      l.registration?.company_name || '',
      l.email || '',
      l.message,
      l.created_at
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      const formattedRow = row.map(val => {
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      });
      csvContent += formattedRow.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewDetails(log: Log) {
    this.dialog.open(LogDetailDialogComponent, {
      data: log,
      width: '60vw',
      maxWidth: '1000px',
      minWidth: '350px',
      maxHeight: '90vh',
      panelClass: 'premium-dialog'
    });
  }
}
