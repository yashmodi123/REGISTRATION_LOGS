import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrationService } from '../../../core/services/registration.service';

@Component({
  selector: 'app-registration-form',
  standalone: false,
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  isEdit = false;
  regId: number | null = null;
  saving = false;

  form: any;

  constructor(
    private fb: FormBuilder,
    private regSvc: RegistrationService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      machine_number:      ['', Validators.required],
      company_name:        ['', Validators.required],
      email:               ['', [Validators.required, Validators.email]],
      date_of_purchase:    [null],
      device_type:         [''],
      country:             [''],
      ip_address:          [''],
      is_using_sinar_mcal: [false, Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.regId  = +id;
      this.regSvc.getAll().subscribe(res => {
        const reg = res.data.find(r => r.id === this.regId);
        if (reg) this.form.patchValue(reg as any);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value as any;

    const action = this.isEdit
      ? this.regSvc.update(this.regId!, val)
      : this.regSvc.create(val);

    action.subscribe({
      next: () => {
        this.snack.open(
          this.isEdit ? 'Registration updated.' : 'Machine registered.',
          'OK', { duration: 3000, panelClass: 'snack-success' }
        );
        this.router.navigate(['/dashboard/registrations']);
      },
      error: (err) => {
        this.snack.open(err?.error?.errors?.[0]?.msg || err?.error?.error || 'Operation failed.', 'OK',
          { duration: 4000, panelClass: 'snack-error' });
        this.saving = false;
      }
    });
  }
}
