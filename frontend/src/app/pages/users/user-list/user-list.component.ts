import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService, AdminUser } from '../../../core/services/user.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  cols = ['id', 'username', 'email', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<AdminUser>();
  users: AdminUser[] = [];
  loading = true;
  debugMode = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userSvc: UserService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.debugMode = params['debug'] === '1';
    });
    this.load();
  }

  load() {
    this.loading = true;
    this.userSvc.getAll().subscribe({
      next: (res) => {
        this.users = res.data;
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  confirmDelete(user: AdminUser) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Admin', message: `Delete admin "${user.username}"?` }
    });
    ref.afterClosed().subscribe(yes => {
      if (yes) this.deleteUser(user.id);
    });
  }

  deleteUser(id: number) {
    this.userSvc.delete(id).subscribe({
      next: () => {
        this.snack.open('Admin deleted.', 'OK', { duration: 3000, panelClass: 'snack-success' });
        this.load();
      },
      error: () => this.snack.open('Delete failed.', 'OK', { duration: 3000, panelClass: 'snack-error' })
    });
  }
}
