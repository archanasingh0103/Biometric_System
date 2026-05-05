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
<<<<<<< HEAD
   employeewithDevice: any[] = [];
  filteredDeviceList: any[] = [];
 private autoRefreshInterval: any;
=======
  employeewithDevice: any[] = [];
  filteredDeviceList: any[] = [];

>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
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

<<<<<<< HEAD
=======
  // dropdown filter
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
  deviceOptions = [
    { label: 'All', value: '' },
    { label: 'Linked', value: '1' },
    { label: 'Unlinked', value: '0' },
  ];

  constructor(private commonService: CommmonService) {}

  ngOnInit(): void {
    this.getEmployeeDropdown();
<<<<<<< HEAD
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

  getEmployeeDropdown() {
    this.commonService.employeeDropdown().subscribe((res: any) => {
      console.log("Employee dropdown:",res);
      this.employeewithDevice = res?.body || [];
    });
  }

=======
  }

  // employee dropdown
  getEmployeeDropdown() {
    this.commonService.employeeDropdown().subscribe((res: any) => {
      this.employeewithDevice = Array.isArray(res) ? res : res.body || [];
    });
  }

  // employee select
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
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

<<<<<<< HEAD
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

      // status filter
      if (this.selectedFilter !== '') {
        list = list.filter(
          (x: any) => String(x.Link) === this.selectedFilter
        );
      }

      //  search filter
      if (this.searchText) {
        const txt = this.searchText.toLowerCase();

        list = list.filter(
          (x: any) =>
            x.DeviceName?.toLowerCase().includes(txt) ||
            x.SerialNumber?.toLowerCase().includes(txt)
        );
      }
      this.filteredDeviceList = list;

      //  pagination count
      this.pagesize.count = res?.body?.totalRecords || list.length;
    });
}
=======
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
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2

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

<<<<<<< HEAD
=======
  // Link / DLink
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
  handleAction(data: any) {
    this.selectedRowData = data;

    if (data.Link === '0') {
<<<<<<< HEAD
=======
      // LINK
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
      this.assignForm.deviceId = data.DeviceId;
      this.assignForm.serialNumbers = data.SerialNumber || '';
      this.assignForm.ValidToDate = '';

      new bootstrap.Modal(document.getElementById('deviceModal')).show();
    } else {
<<<<<<< HEAD
=======
      // DLINK
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
      const payload = {
        employeeCode: this.selectedEmployeeCode,
        deviceId: data.DeviceId,
        serialNumber: data.SerialNumber,
      };

      this.commonService.removeEmployeeDevice(payload).subscribe(() => {
<<<<<<< HEAD
=======
        // console.log();
        
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
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

<<<<<<< HEAD
  //  FINAL FIX: NO UTC conversion
  confirmPopupAction() {
    this.showConfirmPopup = false;

=======
  // final link api
  confirmPopupAction() {
    this.showConfirmPopup = false;

    const local = this.assignForm.ValidToDate;

    let utcDate = null;

    if (local) {
      utcDate = new Date(local).toISOString(); // IST → UTC conversion happens here
    }

>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
    const payload = {
      employeeId: this.assignForm.employeeId,
      employeeCode: this.assignForm.employeeCode,
      deviceId: this.assignForm.deviceId,
      serialNumber: this.assignForm.serialNumbers,
<<<<<<< HEAD
      validToDate: this.assignForm.ValidToDate || null, // direct IST string
=======
      validToDate: utcDate,
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
    };

    this.commonService.assignEmployeeDevice(payload).subscribe(() => {
      this.loadDevices();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('deviceModal'),
      );
      modal?.hide();
    });
  }
<<<<<<< HEAD

=======
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
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
