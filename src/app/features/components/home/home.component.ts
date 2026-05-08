import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
// import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild('donutCanvas')
  donutCanvas!: ElementRef<HTMLCanvasElement>;

  // CLOCK
  currentTime = '';
  currentDate = '';
  greeting = '';
  userName = '';
  private clockTimer: any;


  // DASHBOARD STATS
  loading = true;

  totalDevices = 0;
  totalEmployees = 0;
  linkedDevices = 0;
  unlinkedDevices = 0;
  expiringSoon = 0;

  constructor(private commonService: CommmonService) {}

  // ─────────────────────────────────────
  // ROW 1 CARDS
  // ─────────────────────────────────────
  get row1() {
    return [
      {
        key: 'totalEmployees',
        label: 'Total Employees',
        value: this.totalEmployees,
        icon: 'fa-solid fa-users',
        color: 'blue',
        route: '/dashboard/emp-list',
        desc: 'Registered employees',
      },
      {
        key: 'totalDevices',
        label: 'Total Devices',
        value: this.totalDevices,
        icon: 'fa-solid fa-hard-drive',
        color: 'purple',
        route: '/dashboard/device-list',
        desc: 'Registered biometric devices',
      },
      {
        key: 'linkedDevices',
        label: 'Active Employees',
        value: this.linkedDevices,
        icon: 'fa-solid fa-link',
        color: 'green',
        route: '/dashboard/device-with-emp',
        desc: 'Employee–device links active',
      },
    ];
  }


  // ROW 2 CARDS
  get row2Cards() {
    return [
      {
        key: 'unlinkedDevices',
        label: 'Unlinked Users',
        value: this.unlinkedDevices,
        icon: 'fa-solid fa-link-slash',
        color: 'red',
        route: '/dashboard/emp-with-device',
        desc: 'Pending device assignments',
      },
      {
        key: 'expiringSoon',
        label: 'Expiring Soon',
        value: this.expiringSoon,
        icon: 'fa-solid fa-triangle-exclamation',
        color: 'orange',
        route: '/dashboard/empiry-soon',
        desc: 'Devices expiring in 30 days',
      },
    ];
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────
  ngOnInit(): void {
    this.startClock();

    const raw = localStorage.getItem('userData');

    if (raw) {
      try {
        this.userName = JSON.parse(raw)?.email || 'User';
      } catch {
        this.userName = 'User';
      }
    }

    this.loadSummary();
  }

  ngOnDestroy(): void {
    clearInterval(this.clockTimer);
  }

  // CLOCK METHODS
  
  startClock(): void {
    this.tick();
    this.clockTimer = setInterval(() => this.tick(), 1000);
  }

  tick(): void {
    const now = new Date();
    const h = now.getHours();

    this.greeting =
      h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';

    this.currentTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    this.currentDate = now.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // ─────────────────────────────────────
  // LOAD DASHBOARD DATA
  // ─────────────────────────────────────
  loadSummary(): void {
    this.loading = true;

    this.commonService.getDashboardSummary(30, 1).subscribe({
      next: (res: any) => {
        console.log('Card Data:', res);

        // actual response data
        const data = res?.body?.data;

        // assign values
        this.totalDevices = data?.totalDevices || 0;

        this.totalEmployees = data?.totalEmployees || 0;

        this.linkedDevices = data?.activeEmployees || 0;

        this.unlinkedDevices = data?.totalUnlinkedUser || 0;

        this.expiringSoon = data?.deviceExpiringSoon || 0;

        this.loading = false;
      },

      error: (err) => {
        console.error('Dashboard Error:', err);

        this.loading = false;
      },
    });
  }

  // ── Pure-CSS SVG donut (no external lib needed) ───────────
  // drawDonut() {
  //   // handled in template via SVG stroke-dasharray — no canvas needed
  // }

  // SVG donut helpers
  // readonly R = 54; // circle radius
  // readonly C = 2 * Math.PI * 54; // circumference ≈ 339.3

  // get linkedDash(): string {
  //   const v = (this.linkedPct / 100) * this.C;
  //   return `${v} ${this.C - v}`;
  // }
  // get unlinkedDash(): string {
  //   const v = (this.unlinkedPct / 100) * this.C;
  //   return `${v} ${this.C - v}`;
  // }
  // get linkedOffset(): string {
  //   return `${this.C * 0.25}`; // start at top (−90°)
  // }
  // get unlinkedOffset(): string {
  //   const linked = (this.linkedPct / 100) * this.C;
  //   return `${this.C * 0.25 - linked}`;
  // }
}
