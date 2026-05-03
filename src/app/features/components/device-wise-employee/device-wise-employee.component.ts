import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;
@Component({
  selector: 'app-device-wise-employee',
  imports: [NgxPaginationModule, FormsModule, CommonModule],
  templateUrl: './device-wise-employee.component.html',
  styleUrl: './device-wise-employee.component.css',
})
export class DeviceWiseEmployeeComponent {
  deviceWithEmployee: any[] = [];
  employeeList: any[] = [];
  filteredList: any[] = [];

  selectedDeviceId = '';
  searchText = '';
  selectedFilter = '';

  isLoading = false;

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  deviceOptions = [
    { label: 'All', value: '' },
    { label: 'Linked', value: 'true' },
    { label: 'Unlinked', value: 'false' },
  ];

  tableHeading = [
    { title: 'S No.' },
    { title: 'Employee Id' },
    { title: 'Employee Name' },
    { title: 'Employee Code' },
    { title: 'Link Status' },
    { title: 'Action' },
  ];

  constructor(private commonService: CommmonService) {}

  ngOnInit() {
    this.getDeviceDropdown();
  }

  // DEVICE DROPDOWN API
  getDeviceDropdown() {
    this.commonService.deviceDropdown().subscribe((res: any) => {
      console.log('dropdown response =>', res);

      // MAIN FIX
      this.deviceWithEmployee = res?.body || res || [];
    });
  }

  // TABLE DATA API
 loadDevices() {
  if (!this.selectedDeviceId) return;

  this.isLoading = true;

  let linkValue: any = undefined;

  // API returns Link = "1" / "0"
  if (this.selectedFilter === 'true') linkValue = true;
  if (this.selectedFilter === 'false') linkValue = false;

  this.commonService
    .getDeviceWiseEmloyee(
      this.selectedDeviceId,
      this.pagesize.offset,
      this.pagesize.limit,
      this.searchText,
      linkValue
    )
    .subscribe((res: any) => {
      this.isLoading = false;

      // MAIN FIX
      const list = Array.isArray(res) ? res : res?.body || [];

      this.filteredList = list;

      // some APIs don't send TotalCount
      this.pagesize.count =
        list.length > 0
          ? list[0]?.TotalCount || list.length
          : 0;
    });
}



  onSelectDevice(event: any) {
    this.selectedDeviceId = event.target.value;
    this.pagesize.offset = 1;
    this.loadDevices();
  }

  onSearchDevice() {
    this.pagesize.offset = 1;
    this.loadDevices();
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.target.value;
    this.pagesize.offset = 1;
    this.loadDevices();
  }

  onTablePageChange(page: number) {
    this.pagesize.offset = page;
    this.loadDevices();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.loadDevices();
  }

 

  // Replace toggleLink() method

toggleLink(emp: any) {
  const payload = {
    employeeCode: emp.EmployeeCode,
    deviceId: +this.selectedDeviceId,
    serialNumber: emp.SerialNumber || '',
  };

  if (emp.Link == '1') {
    // DLink API
    this.commonService.removeEmployeeDevice(payload).subscribe(() => {
      this.loadDevices();
    });
  } else {
    // Link API
    const body = {
      employeeId: 0,
      employeeCode: emp.EmployeeCode,
      deviceId: +this.selectedDeviceId,
      serialNumber: emp.SerialNumber || '',
      validToDate: new Date().toISOString(),
    };

    this.commonService.assignEmployeeDevice(body).subscribe(() => {
      this.loadDevices();
    });
  }
}

  get startValue(): number {
    if (this.pagesize.count === 0) return 0;
    return (this.pagesize.offset - 1) * this.pagesize.limit + 1;
  }

  get lastValue(): number {
    return Math.min(
      this.pagesize.offset * this.pagesize.limit,
      this.pagesize.count,
    );
  }
}
