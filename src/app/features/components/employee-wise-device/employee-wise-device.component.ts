import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';
declare var bootstrap: any;
@Component({
  selector: 'app-employee-wise-device',
  imports: [
    NgxPaginationModule,
    FormsModule,
    CommonModule,
    SelectDropDownModule,
  ],
  templateUrl: './employee-wise-device.component.html',
  styleUrl: './employee-wise-device.component.css',
})
export class EmployeeWiseDeviceComponent {
  employeewithDevice: any[] = [];
  filteredDeviceList: any[] = [];

  private autoRefreshInterval: any;
  selectedEmployeeCode: string = '';
  selectedFilter = '';
  searchText = '';

  isLoading = false;
  showConfirmPopup = false;
  selectedRowData: any = null;

  dropdownOptions: any[] = [];
  dropdownConfig = {
    displayKey: 'employeeCode',
    valueKey: 'employeeCode',
    search: true,
    height: '250px',
    placeholder: 'Select Employee',
  };

  assignForm = {
    employeeId: 0,
    employeeCode: '',
    deviceId: 0,
    serialNumbers: '',
    ValidToDate: '',
  };

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  deviceOptions = [
    { label: 'All', value: '' },
    { label: 'Linked', value: '1' },
    { label: 'Unlinked', value: '0' },
  ];

  tableHeading = [
    { title: 'S No.' },
    { title: 'Device ID' },
    { title: 'Device Full Name' },
    { title: 'Serial Number' },
    { title: 'Link Status' },
    { title: 'Action' },
    { title: 'Expiry' },
  ];

  constructor(private commonService: CommmonService) {}

  ngOnInit(): void {
    this.getEmployeeDropdown();
     this.startAutoRefreshAt1205AM();
  }
    ngOnDestroy(): void {
    //  NEW: prevent memory leak
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }
     startAutoRefreshAt1205AM() {
    this.autoRefreshInterval = setInterval(() => {

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      //  12:05 AM trigger
      if (hours === 0 && minutes === 5) {

        if (this.selectedEmployeeCode) {
          this.loadDevices(); // refresh API call
        }

      }

    }, 60000); // check every 1 minute
  }

  //  FIX: dropdown data
  getEmployeeDropdown() {
    this.commonService.employeeDropdown().subscribe((res: any) => {
      console.log('Employee dropdown:', res);
      this.employeewithDevice = res?.body || [];
      this.dropdownOptions = this.employeewithDevice;
    });
  }

  // FIX: ngx dropdown gives object OR value
  onSelectEmployee(event: any) {
    const emp = event?.value || event; //  IMPORTANT FIX

    if (!emp) return;

    this.selectedEmployeeCode = emp.employeeCode;

    this.assignForm.employeeId = emp.employeeId || 0;
    this.assignForm.employeeCode = emp.employeeCode || '';

    this.pagesize.offset = 1;
    this.loadDevices();
  }

  loadDevices() {
    if (!this.selectedEmployeeCode) return;

    this.isLoading = true;

    this.commonService
      .getEmployeeWiseDevice(
        this.selectedEmployeeCode,
        this.searchText,
        this.pagesize.offset,
        this.pagesize.limit,
      )
      .subscribe((res: any) => {
        this.isLoading = false;

        let list = res?.body?.data || [];

        if (this.selectedFilter !== '') {
          list = list.filter(
            (x: any) => String(x.Link) === this.selectedFilter,
          );
        }

        if (this.searchText) {
          const txt = this.searchText.toLowerCase();

          list = list.filter(
            (x: any) =>
              x.DeviceName?.toLowerCase().includes(txt) ||
              x.SerialNumber?.toLowerCase().includes(txt),
          );
        }

        this.filteredDeviceList = list;
        this.pagesize.count = res?.body?.totalRecords || list.length;
      });
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
    this.loadDevices();
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.target.value;
    this.loadDevices();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.loadDevices();
  }

  onTablePageChange(page: number) {
    this.pagesize.offset = page;
    this.loadDevices();
  }

  handleAction(data: any) {
    this.selectedRowData = data;

    if (data.Link === '0') {
      this.assignForm.deviceId = data.DeviceId;
      this.assignForm.serialNumbers = data.SerialNumber || '';
      this.assignForm.ValidToDate = '';

      new bootstrap.Modal(document.getElementById('deviceModal')).show();
    } else {
      const payload = {
        employeeCode: this.selectedEmployeeCode,
        deviceId: data.DeviceId,
        serialNumber: data.SerialNumber,
      };

      this.commonService.removeEmployeeDevice(payload).subscribe(() => {
        this.loadDevices();
      });
    }
  }

  submitAssignDevice() {
    this.showConfirmPopup = true;
  }

  closePopup() {
    this.showConfirmPopup = false;
  }

  confirmPopupAction() {
    this.showConfirmPopup = false;

    const payload = {
      employeeId: this.assignForm.employeeId,
      employeeCode: this.assignForm.employeeCode,
      deviceId: this.assignForm.deviceId,
      serialNumber: this.assignForm.serialNumbers,
      validToDate: this.assignForm.ValidToDate || null,
    };

    this.commonService.assignEmployeeDevice(payload).subscribe(() => {
      this.loadDevices();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('deviceModal'),
      );
      modal?.hide();
    });
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
