import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DeviceListComponent } from '../device-list/device-list.component';
import { DeviceWiseEmployeeComponent } from '../device-wise-employee/device-wise-employee.component';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeWiseDeviceComponent } from '../employee-wise-device/employee-wise-device.component';
import { HomeComponent } from '../home/home.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', component: HomeComponent },
      { path: 'device-list', component: DeviceListComponent },
      { path: 'device-with-emp', component: DeviceWiseEmployeeComponent },
      { path: 'emp-list', component: EmployeeListComponent },
      { path: 'emp-with-device', component: EmployeeWiseDeviceComponent },
    ],
  },
];
