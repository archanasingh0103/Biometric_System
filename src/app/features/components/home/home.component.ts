import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
// import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  loading: boolean = true;

  stats = [
    { label: 'Total Devices', value: 0, icon: 'fa-solid fa-hard-drive', color: 'blue', route: '/dashboard/device-list', desc: 'Registered biometric devices', loaded: false },
    { label: 'Total Employees', value: 0, icon: 'fa-solid fa-users', color: 'purple', route: '/dashboard/emp-list', desc: 'Registered employees in system', loaded: false },
    { label: 'Active Links', value: 0, icon: 'fa-solid fa-link', color: 'green', route: '/dashboard/device-with-emp', desc: 'Employee-device links active', loaded: true },
    { label: 'Unlinked Devices', value: 0, icon: 'fa-solid fa-link-slash', color: 'red', route: '/dashboard/emp-with-device', desc: 'Pending device assignments', loaded: true },
  ];

  quickLinks = [
    { label: 'Device List', icon: 'fa-solid fa-hard-drive', route: '/dashboard/device-list', desc: 'View & manage all biometric devices', color: 'blue' },
    { label: 'Employee Wise Device', icon: 'fa-solid fa-id-card', route: '/dashboard/emp-with-device', desc: 'See devices assigned to each employee', color: 'amber' },
    { label: 'Device Wise Employee', icon: 'fa-solid fa-building-user', route: '/dashboard/device-with-emp', desc: 'See employees linked to each device', color: 'purple' },
    { label: 'Employee List', icon: 'fa-solid fa-users', route: '/dashboard/emp-list', desc: 'Browse all registered employees', color: 'green' },
  ];

  currentTime: string = '';
  currentDate: string = '';
  userName: string = '';
  greeting: string = '';

  constructor(private commonService: CommmonService) {}

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.email || 'User';
    }
    this.loadDeviceCount();
    this.loadEmployeeCount();
  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.currentDate = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const hour = now.getHours();
    this.greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  }

  loadDeviceCount() {
    this.commonService.deviceList(1, 1000).subscribe({
      next: (res: any) => {
        const total = res?.totalCount || res?.data?.length || 0;
        this.stats[0].value = total;
        this.stats[0].loaded = true;
        this.checkLoading();
      },
      error: () => { this.stats[0].loaded = true; this.checkLoading(); },
    });
  }

  loadEmployeeCount() {
    this.commonService.employeeList(1, 1000).subscribe({
      next: (res: any) => {
        const total = res?.totalCount || res?.data?.length || 0;
        this.stats[1].value = total;
        this.stats[1].loaded = true;
        this.checkLoading();
      },
      error: () => { this.stats[1].loaded = true; this.checkLoading(); },
    });
  }

  checkLoading() {
    if (this.stats[0].loaded && this.stats[1].loaded) { this.loading = false; }
  }
}
