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
 @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;

  // CLOCK
  currentTime = '';
  currentDate = '';
  greeting = '';
  userName = '';
  private clockTimer: any;

  // LOADING
  loading = true;

  // DASHBOARD DATA
  totalDevices = 0;
  totalEmployees = 0;
  linkedDevices = 0;
  unlinkedDevices = 0;
  expiringSoon = 0;

  // DONUT DATA
  donutData = {
    total: 0,
    linked: 0,
    unlinked: 0,
  };

  constructor(private commonService: CommmonService) {}

  // ROW 1
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

  // ROW 2
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

  // INIT
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
    this.loadDonut();
  }

  ngOnDestroy(): void {
    clearInterval(this.clockTimer);
  }

  // CLOCK
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

  // DASHBOARD API
  loadSummary(): void {
    this.loading = true;

    this.commonService.getDashboardSummary(30, 1).subscribe({
      next: (res: any) => {
        const data = res?.body.data || {};

        this.totalDevices = data.totalDevices || 0;
        this.totalEmployees = data.totalEmployees || 0;
        this.linkedDevices = data.activeEmployees || 0;
        this.unlinkedDevices = data.totalUnlinkedUser || 0;
        this.expiringSoon = data.deviceExpiringSoon || 0;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  // DONUT API
 loadDonut(): void {
  this.commonService.donutSummary().subscribe({
    next: (res: any) => {
      console.log("Donut Response:", res);

      const data = res?.body; // ✅ FIXED HERE

      const linked = data?.distribution?.find(
        (x: any) => x.label === 'Linked Devices'
      );

      const unlinked = data?.distribution?.find(
        (x: any) => x.label === 'Unlinked Devices'
      );

      this.donutData = {
        total: data?.totalDevices || 0,
        linked: linked?.count || 0,
        unlinked: unlinked?.count || 0,
      };
    },
    error: (err) => console.error(err),
  });
}
circumference = 2 * Math.PI * 54;

get linkedOffset(): number {
  return (
    this.circumference -
    (this.linkedPct / 100) * this.circumference
  );
}
  // DONUT PERCENT
  get linkedPct(): number {
    if (!this.donutData.total) return 0;
    return Math.round((this.donutData.linked / this.donutData.total) * 100);
  }

  get unlinkedPct(): number {
    return 100 - this.linkedPct;
  }
}
