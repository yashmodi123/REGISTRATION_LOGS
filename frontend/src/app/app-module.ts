import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { MaterialModule } from './shared/material.module';

// Core
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Components
import { App } from './app';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';

// Users
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';

// Registrations
import { RegistrationListComponent } from './pages/registrations/registration-list/registration-list.component';
import { RegistrationFormComponent } from './pages/registrations/registration-form/registration-form.component';

// Logs
import { LogsComponent } from './pages/logs/logs.component';
import { LogDetailDialogComponent } from './pages/logs/log-detail-dialog/log-detail-dialog.component';

// Shared
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    App,
    LayoutComponent,
    LoginComponent,
    UserListComponent,
    UserFormComponent,
    RegistrationListComponent,
    RegistrationFormComponent,
    LogsComponent,
    LogDetailDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule {}
