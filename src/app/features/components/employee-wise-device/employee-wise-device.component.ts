import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;
@Component({
  selector: 'app-employee-wise-device',
  imports: [NgxPaginationModule, FormsModule, CommonModule],
  templateUrl: './employee-wise-device.component.html',
  styleUrl: './employee-wise-device.component.css',
})
export class EmployeeWiseDeviceComponent {
  employeewithDevice: any[] = [];
  filteredDeviceList: any[] = [];

  selectedEmployeeCode = '';
  selectedFilter = '';
  searchText = '';

  isLoading = false;
  showConfirmPopup = false;

  selectedRowData: any = null;

  tableHeading = [
    { title: 'S No.' },
    { title: 'Device ID' },
    { title: 'Device Full Name' },
    { title: 'Serial Number' },
    { title: 'Link Status' },
    { title: 'Action' },
    { title: 'Expiry' },
  ];

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

  // dropdown filter
  deviceOptions = [
    { label: 'All', value: '' },
    { label: 'Linked', value: '1' },
    { label: 'Unlinked', value: '0' },
  ];

  constructor(private commonService: CommmonService) {}

  ngOnInit(): void {
    this.getEmployeeDropdown();
  }

  // employee dropdown
  getEmployeeDropdown() {
    this.commonService.employeeDropdown().subscribe((res: any) => {
      this.employeewithDevice = Array.isArray(res) ? res : res.body || [];
    });
  }

  // employee select
  onSelectEmployee(event: any) {
    const code = event.target.value;
    const emp = this.employeewithDevice.find(
      (x: any) => x.employeeCode === code,
    );

    this.selectedEmployeeCode = code;
    this.assignForm.employeeId = emp?.employeeId || 0;
    this.assignForm.employeeCode = emp?.employeeCode || '';

    this.pagesize.offset = 1;
    this.loadDevices();
  }

  // table load
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

        let list = Array.isArray(res) ? res : res.body || [];

        // status filter
        if (this.selectedFilter !== '') {
          list = list.filter(
            (x: any) => String(x.Link) === this.selectedFilter,
          );
        }

        // search filter
        if (this.searchText) {
          const txt = this.searchText.toLowerCase();

          list = list.filter(
            (x: any) =>
              x.DeviceName?.toLowerCase().includes(txt) ||
              x.SerialNumber?.toLowerCase().includes(txt),
          );
        }

        list = list.map((x: any) => {
          let value = x.ValidToDate;

          if (
            !value ||
            (typeof value === 'object' && Object.keys(value).length === 0)
          ) {
            return { ...x, ValidToDate: null };
          }

          let date = new Date(value + 'Z');
          // force UTC interpretation

          if (isNaN(date.getTime())) {
            return { ...x, ValidToDate: null };
          }

          return {
            ...x,
            ValidToDate: date,
          };
        });

        this.filteredDeviceList = list;
        this.pagesize.count = list[0]?.TotalCount || list.length;
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

  // Link / DLink
  handleAction(data: any) {
    this.selectedRowData = data;

    if (data.Link === '0') {
      // LINK
      this.assignForm.deviceId = data.DeviceId;
      this.assignForm.serialNumbers = data.SerialNumber || '';
      this.assignForm.ValidToDate = '';

      new bootstrap.Modal(document.getElementById('deviceModal')).show();
    } else {
      // DLINK
      const payload = {
        employeeCode: this.selectedEmployeeCode,
        deviceId: data.DeviceId,
        serialNumber: data.SerialNumber,
      };

      this.commonService.removeEmployeeDevice(payload).subscribe(() => {
        // console.log();
        
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

  // final link api
  confirmPopupAction() {
    this.showConfirmPopup = false;

    const local = this.assignForm.ValidToDate;

    let utcDate = null;

    if (local) {
      utcDate = new Date(local).toISOString(); // IST → UTC conversion happens here
    }

    const payload = {
      employeeId: this.assignForm.employeeId,
      employeeCode: this.assignForm.employeeCode,
      deviceId: this.assignForm.deviceId,
      serialNumber: this.assignForm.serialNumbers,
      validToDate: utcDate,
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
