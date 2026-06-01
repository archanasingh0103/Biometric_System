import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { CommmonService } from '../../shared/services/common-service/common.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  currentTime = '';
  currentDate = '';
  greeting = '';
  userName = '';
  private clockTimer: any;
  donutLoading = true;
  loading = true;
  chartLoading = true;

  // ── Dashboard API data ──────────────────────────────────
  totalEmployees = 0;
  activeEmployees = 0;
  totalDevices = 0;
  expiringSoon = 0;
  unlinkedDevices = 0;

  // ── Donut data ──────────────────────────────────────────
  linkedDevices = 0;
  unlinkedDonut = 0;
  totalDonut = 0;

  // ── Bar chart data (GetDeviceEmployeeChart) ─────────────
  // Swagger: { devices: [{ deviceName, employeeCount }] }
  chartData: { deviceName: string; employeeCount: number }[] = [];
  chartMax = 1;

  readonly R = 44;
  readonly C = 2 * Math.PI * this.R;

  constructor(private svc: CommmonService) {}

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
    this.loadDashboard();
    this.loadDonut();
    this.loadChart();
  }

  ngOnDestroy(): void {
    clearInterval(this.clockTimer);
  }

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

  // ── API 1: Dashboard Summary ─────────────────────────────
  loadDashboard(): void {
    this.loading = true;
    this.svc.getDashboardSummary(1, 0).subscribe({
      next: (res: any) => {
        console.log('Dashboard Response:', res);
        const d = res?.body?.data || {};
        this.totalEmployees = d.totalEmployees || 0;
        this.activeEmployees = d.activeEmployees || 0;
        this.totalDevices = d.totalDevices || 0;
        this.expiringSoon = d.deviceExpiringSoon || 0;
        this.unlinkedDevices = d.totalUnlinkedUser || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.loading = false;
      },
    });
  }

  // ── API 2: Donut ─────────────────────────────────────────
  loadDonut(): void {
    this.donutLoading = true;
    this.svc.donutSummary().subscribe({
      next: (res: any) => {
        console.log('Donut Response:', res);
        const d = res?.body || {};
        this.totalDonut = d.totalDevices || 0;
        const distribution = d.distribution || [];
        const linked = distribution.find(
          (x: any) => x.label === 'Linked Devices',
        );
        const unlinked = distribution.find(
          (x: any) => x.label === 'Unlinked Devices',
        );
        this.linkedDevices = linked?.count || 0;
        this.unlinkedDonut = unlinked?.count || 0;
        this.donutLoading = false;
      },
      error: (err) => {
        console.error('Donut Error:', err);
        this.donutLoading = false;
      },
    });
  }

  // ── API 3: Device Employee Bar Chart ─────────────────────
  // Response: { isSuccess, devices: [{ deviceName, employeeCount }] }
  loadChart(): void {
    this.chartLoading = true;
    this.svc.deviceEmployeeChart().subscribe({
      next: (res: any) => {
        const raw: { deviceName: string; employeeCount: number }[] =
          res?.devices ?? res?.body?.devices ?? [];

        // Keep API order, filter empty if needed
        this.chartData = raw;

        // Max for Y-axis scaling — minimum 1 to avoid div/0
        this.chartMax = raw.length
          ? Math.max(...raw.map((d) => d.employeeCount), 1)
          : 1;

        this.chartLoading = false;
      },
      error: () => {
        this.chartLoading = false;
      },
    });
  }

  // ── Y-axis ticks: 0 → chartMax in 5 steps ────────────────
  get yTicks(): number[] {
    const step = Math.ceil(this.chartMax / 5) || 1;
    const ticks: number[] = [];
    for (let i = 5; i >= 0; i--) {
      ticks.push(i * step);
    }
    return ticks;
  }

  // ── Bar height as % of chart area ─────────────────────────
  barHeightPct(count: number): number {
    if (this.chartMax === 0) return 0;
    const pct = (count / this.chartMax) * 100;
    return count > 0 ? Math.max(pct, 3) : 0;
  }

  // ── Donut helpers ─────────────────────────────────────────
  get linkedPct(): number {
    return this.totalDonut
      ? Math.round((this.linkedDevices / this.totalDonut) * 100)
      : 0;
  }
  get unlinkedPct(): number {
    return this.totalDonut
      ? Math.round((this.unlinkedDonut / this.totalDonut) * 100)
      : 0;
  }
  get expiringPct(): number {
    return this.totalDonut
      ? Math.round((this.expiringSoon / this.totalDonut) * 100)
      : 0;
  }
  get linkedDash(): string {
    const v = (this.linkedPct / 100) * this.C;
    return `${v} ${this.C - v}`;
  }
  get linkedOffset(): string {
    return `${this.C * 0.25}`;
  }

  // ── 5 Stat Cards ──────────────────────────────────────────
  get allStats() {
    return [
      {
        label: 'Total Employees',
        value: this.totalEmployees,
        icon: 'fa-solid fa-users',
        color: 'blue',
        route: '/dashboard/emp-list',
        desc: 'Registered employees',
      },
      {
        label: 'Total Devices',
        value: this.totalDevices,
        icon: 'fa-solid fa-hard-drive',
        color: 'purple',
        route: '/dashboard/device-list',
        desc: 'Registered biometric devices',
      },
      {
        label: 'Active Employees',
        value: this.activeEmployees,
        icon: 'fa-solid fa-link',
        color: 'green',
        route: '/dashboard/device-with-emp',
        desc: 'Employee-device links active',
      },
      {
        label: 'Unlinked Users',
        value: this.unlinkedDevices,
        icon: 'fa-solid fa-link-slash',
        color: 'red',
        route: '/dashboard/emp-with-device',
        desc: 'Pending device assignments',
      },
      {
        label: 'Expiring Soon',
        value: this.expiringSoon,
        icon: 'fa-solid fa-triangle-exclamation',
        color: 'orange',
        route: '/dashboard/empiry-soon',
        desc: 'Devices expiring soon',
      },
    ];
  }
}
