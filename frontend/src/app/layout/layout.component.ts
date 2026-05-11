import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  sidenavOpen = true;
  sidenavMode: 'side' | 'over' = 'side';
  pageTitle = 'Dashboard';
  user: any;

  private titleMap: Record<string, string> = {
    '/dashboard/registrations': 'Registrations',
    '/dashboard/users':         'Admin Users',
    '/dashboard/logs':          'Log History',
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser;
    this.checkBreakpoint(window.innerWidth);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const key = Object.keys(this.titleMap).find(k => e.urlAfterRedirects.startsWith(k));
      this.pageTitle = key ? this.titleMap[key] : 'Dashboard';
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.checkBreakpoint(window.innerWidth); }

  checkBreakpoint(width: number) {
    this.sidenavMode = width < 768 ? 'over' : 'side';
    this.sidenavOpen = width >= 768;
  }

  toggleSidenav() { this.sidenavOpen = !this.sidenavOpen; }

  logout() { this.auth.logout(); }
}
