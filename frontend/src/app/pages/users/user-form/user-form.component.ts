import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  isEdit = false;
  userId: number | null = null;
  saving  = false;
  showPass = false;

  form: any;

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = +id;
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.userSvc.getById(this.userId).subscribe(res => {
        this.form.patchValue({ username: res.data.username, email: res.data.email });
      });
    } else {
      this.form.get('password')?.addValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value;

    const action = this.isEdit
      ? this.userSvc.update(this.userId!, { username: val.username!, email: val.email! })
      : this.userSvc.create({ username: val.username!, email: val.email!, password: val.password! });

    action.pipe(finalize(() => this.saving = false)).subscribe({
      next: () => {
        this.snack.open(this.isEdit ? 'Updated successfully.' : 'Admin created.', 'OK',
          { duration: 3000, panelClass: 'snack-success' });
        this.router.navigate(['/dashboard/users']);
      },
      error: (err) => {
        this.snack.open(err?.error?.error || 'Operation failed.', 'OK',
          { duration: 4000, panelClass: 'snack-error' });
      }
    });
  }
}
