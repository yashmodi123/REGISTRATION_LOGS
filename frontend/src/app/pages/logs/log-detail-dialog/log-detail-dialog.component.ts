import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Log } from '../../../core/services/log.service';

@Component({
  selector: 'app-log-detail-dialog',
  standalone: false,
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <span class="chip" [ngClass]="data.type === 'USAGE' ? 'chip-usage' : 'chip-error'">{{ data.type }}</span>
        <span class="log-id">Log Entry #{{ data.id }}</span>
      </h2>
      <button mat-icon-button mat-dialog-close class="close-btn"><mat-icon>close</mat-icon></button>
    </div>

    <mat-dialog-content>
      <div class="row"><strong>Email:</strong> {{ data.email || '—' }}</div>
      <div class="row"><strong>Timestamp:</strong> {{ data.created_at | date:'dd MMM yyyy, HH:mm:ss' }}</div>
      <div class="row"><strong>Message:</strong> {{ data.message }}</div>
      
      <div class="details-box" *ngIf="formatted">
        <label>Details:</label>
        <pre>{{ formatted }}</pre>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: rgba(0,0,0,0.2);
      border-bottom: 1px solid var(--color-border);
      
      h2 { 
        display: flex; align-items: center; gap: 12px; margin: 0 !important; padding: 0 !important; 
        font-size: 1.1rem; font-weight: 700; color: #fff;
      }
      .close-btn { color: var(--color-text-hint); }
    }
    
    mat-dialog-content { padding: 24px !important; margin: 0 !important; }
    
    .row { margin-bottom: 16px; font-size: 0.95rem; color: var(--color-text-primary); }
    .details-box {
      margin-top: 24px;
      label { display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.75rem; color: var(--color-text-hint); text-transform: uppercase; letter-spacing: 0.5px; }
      pre {
        background: #000;
        color: #81C784;
        padding: 16px;
        border-radius: 4px;
        font-size: 0.85rem;
        max-height: 600px;
        overflow-y: auto;
        overflow-x: hidden;
        white-space: pre-wrap;
        word-break: break-all;
        border: none !important;
        box-shadow: none !important;
        
        &::-webkit-scrollbar { width: 8px; }
        &::-webkit-scrollbar-track { background: transparent; }
        &::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      }
    }
  `]
})
export class LogDetailDialogComponent {
  formatted: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Log,
    public dialogRef: MatDialogRef<LogDetailDialogComponent>
  ) {
    try {
      const parsed = typeof data.details === 'string' ? JSON.parse(data.details) : data.details;
      this.formatted = JSON.stringify(parsed || {}, null, 2);
    }
    catch { this.formatted = data.details || ''; }
  }
}
