import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { RegistrationListComponent } from './pages/registrations/registration-list/registration-list.component';
import { RegistrationFormComponent } from './pages/registrations/registration-form/registration-form.component';
import { LogsComponent } from './pages/logs/logs.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'registrations', pathMatch: 'full' },
      // Registrations
      { path: 'registrations',        component: RegistrationListComponent },
      { path: 'registrations/new',    component: RegistrationFormComponent },
      { path: 'registrations/:id/edit', component: RegistrationFormComponent },
      // Users
      { path: 'users',           component: UserListComponent },
      { path: 'users/new',       component: UserFormComponent },
      { path: 'users/:id/edit',  component: UserFormComponent },
      // Logs
      { path: 'logs', component: LogsComponent }
    ]
  },
  { path: '', redirectTo: '/dashboard/registrations', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard/registrations' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
