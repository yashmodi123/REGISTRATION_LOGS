import { Component, OnInit, ViewChild } from '@angular/core';
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

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.regSvc.getAll().subscribe({
      next: (res) => {
        const data = res?.data || [];
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.total     = data.length;
        this.usingMcal = data.filter(r => r.is_using_sinar_mcal).length;
        this.loading   = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
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
