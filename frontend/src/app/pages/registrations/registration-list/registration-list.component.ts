import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationService, Registration } from '../../../core/services/registration.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-registration-list',
  standalone: false,
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {
  cols = ['id', 'machine_number', 'company_name', 'email', 'country', 'is_using_sinar_mcal', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<Registration>();
  total    = 0;
  usingMcal = 0;
  loading  = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private regSvc: RegistrationService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.load();
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(val => {
      this.searchQuery = val;
      if (this.paginator) this.paginator.pageIndex = 0;
      this.load();
    });
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.load());
  }

  load() {
    this.loading = true;
    const params = {
      page: this.paginator ? this.paginator.pageIndex + 1 : 1,
      limit: this.paginator ? this.paginator.pageSize : 10,
      search: this.searchQuery || ''
    };

    this.regSvc.getAll(params).subscribe({
      next: (res) => {
        const data = res?.data || [];
        this.dataSource.data = data;
        this.total = res.total || 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  searchQuery = '';
  applyFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchSubject.next(val);
  }

  viewLogs(email: string) {
    this.router.navigate(['/dashboard/logs'], { queryParams: { email } });
  }

  confirmDelete(reg: Registration) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Registration', message: `Delete machine "${reg.machine_number}"?` }
    });
    ref.afterClosed().subscribe(yes => {
      if (yes) this.delete(reg.id);
    });
  }

  delete(id: number) {
    this.regSvc.delete(id).subscribe({
      next: () => {
        this.snack.open('Registration deleted.', 'OK', { duration: 3000, panelClass: 'snack-success' });
        this.load();
      },
      error: () => this.snack.open('Delete failed.', 'OK', { duration: 3000, panelClass: 'snack-error' })
    });
  }
}
