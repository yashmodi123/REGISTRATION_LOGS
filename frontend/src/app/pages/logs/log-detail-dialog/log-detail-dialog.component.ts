import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Log } from '../../../core/services/log.service';

@Component({
  selector: 'app-log-detail-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>
      <mat-chip [class]="data.type === 'USAGE' ? 'chip-usage' : 'chip-error'">{{ data.type }}</mat-chip>
      &nbsp; Log #{{ data.id }}
    </h2>
    <mat-dialog-content>
      <dl class="detail-list">
        <dt>Email</dt>     <dd>{{ data.email || '—' }}</dd>
        <dt>Message</dt>   <dd>{{ data.message }}</dd>
        <dt>Timestamp</dt> <dd>{{ data.created_at | date:'dd MMM yyyy, HH:mm:ss' }}</dd>
        <dt>Details</dt>   <dd><pre class="details-pre">{{ formatted }}</pre></dd>
      </dl>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .detail-list { display: grid; grid-template-columns: 110px 1fr; gap: 8px 16px; }
    dt { font-weight: 600; color: var(--color-text-secondary); font-size: 0.85rem; }
    dd { margin: 0; }
    .details-pre { background: var(--color-surface-2); border-radius: 6px; padding: 10px;
      font-size: 0.82rem; overflow: auto; max-height: 200px; white-space: pre-wrap; word-break: break-all; }
    mat-chip { font-size: 0.75rem; }
  `]
})
export class LogDetailDialogComponent {
  formatted: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Log,
    public dialogRef: MatDialogRef<LogDetailDialogComponent>
  ) {
    try { this.formatted = JSON.stringify(JSON.parse(data.details || '{}'), null, 2); }
    catch { this.formatted = data.details || '—'; }
  }
}
