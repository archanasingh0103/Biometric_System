import { Component } from '@angular/core';
import { CommmonService } from '../../../shared/services/common-service/common.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-pagination',
  imports: [FormsModule,CommonModule,NgxPaginationModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
 employeewithDevice: any[] = [];
  deviceList: any[] = [];
  filteredDeviceList: any[] = [];
  selectedRowData: any = null;
  isLoading: boolean = false;

  

  assignForm = {
    employeeId: 0,
    deviceId: 0,
    deviceName: '',
    expiryDate: '',
  };

  selectedEmployeeCode: string = '';
  searchText: string = '';
  selectedFilter: string = ''; 

  tableHeading: any;

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  //  Dropdown options
  deviceOptions = [
    { label: 'All', value: '' },
    { label: 'Link', value: 'true' },
    { label: 'DLink', value: 'false' },
  ];

  constructor(private commonService: CommmonService) {}

  ngOnInit() {
    this.getEmployeeList();
    this.setInitialValue();
  }

  setInitialValue() {
    this.tableHeading = [
      { key: 'Sno.', title: 'S No.' },
      { key: 'deviceId', title: 'Device ID' },
      { key: 'deviceFName', title: 'Device Full Name' },
      { key: 'link', title: 'Link' },
      { key: 'action', title: 'Action' },
      { key: 'expiry', title: 'Expiry' },
    ];
  }

  //  COUNTING
  get startValue(): number {
    return (
      this.pagesize.offset * this.pagesize.limit - (this.pagesize.limit - 1)
    );
  }

  get lastValue(): number {
    return Math.min(
      this.startValue + this.pagesize.limit - 1,
      this.pagesize.count,
    );
  }

  //  LOAD DEVICE
  loadDevices() {
    if (!this.selectedEmployeeCode) {
      this.deviceList = [];
      this.filteredDeviceList = [];
      this.pagesize.count = 0;
      return;
    }

    this.isLoading = true;

    let link: any = null;

    if (this.selectedFilter === 'true') {
      link = false;
    } else if (this.selectedFilter === 'false') {
      link = true;
    } else {
      link = undefined;
    }

    this.commonService
      .getEmployeeWiseDevice(
        this.selectedEmployeeCode,
        this.pagesize.offset,
        this.pagesize.limit,
        link,
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.deviceList = res.body?.devices || [];
          this.applySearchFilter();
        },
        error: () => {
          this.isLoading = false;
          this.deviceList = [];
          this.filteredDeviceList = [];
          this.pagesize.count = 0;
        },
      });
  }

  //  EMPLOYEE LIST
  getEmployeeList() {
    this.commonService.employeeList().subscribe((res: any) => {
      this.employeewithDevice = res?.body?.data?.data || [];
    });
  }




  //  SELECT EMPLOYEE
  // onSelectEmployee(event: any) {
  //   this.selectedEmployeeCode = event.target.value;
  //   this.pagesize.offset = 1;
  //   this.loadDevices();

  //   // this.commonService.employeeDropdown().subscribe((res: any) => {
  //   //   console.log(res);
  //   //   this.employeewithDevice=res;
      
  //   // })
  // }

  onSelectEmployee(event: any) {
  this.selectedEmployeeCode = event.target.value;
  this.pagesize.offset = 1;
  this.loadDevices();
}

//   // EMPLOYEE DROPDOWN API
// getEmployeeDropdown() {
//   this.commonService.employeeDropdown().subscribe({
//     next: (res: any) => {
//       console.log('Dropdown API Response:', res);

//       this.employeewithDevice = res?.body?.data || [];

//       // agar structure different ho to ye try karo:
//       // this.employeewithDevice = res?.body || res || [];
//     },
//     error: () => {
//       this.employeewithDevice = [];
//     }
//   });
// }
  //  SEARCH (ONLY LOCAL)
  onSearch(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.pagesize.offset = 1;
    this.applySearchFilter();
  }

  //FILTER CHANGE (API CALL)
  onFilterChange(event: any) {
    this.selectedFilter = event.target.value;
    this.pagesize.offset = 1;
    this.loadDevices(); //
  }

  //  ONLY SEARCH FILTER
  applySearchFilter() {
    let tempList = [...this.deviceList];

    if (this.searchText) {
      tempList = tempList.filter((item: any) =>
        Object.values(item || {}).some((val) =>
          val?.toString().toLowerCase().includes(this.searchText),
        ),
      );
    }

    this.filteredDeviceList = tempList;
    this.pagesize.count = tempList.length;
  }

  //  PAGINATION
  onTablePageChange(event: number) {
    this.pagesize.offset = event;
    this.loadDevices();
  }

  //  PAGE SIZE
  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.loadDevices();
  }

  //  UPDATE ACCESS
  updateAccess(deviceId: number) {
    let selectedDevices = this.deviceList
      .filter((d) => d.status)
      .map((d) => d.deviceId);

    if (selectedDevices.includes(deviceId)) {
      selectedDevices = selectedDevices.filter((id) => id !== deviceId);
    } else {
      selectedDevices.push(deviceId);
    }

    const payload = {
      employeeCode: this.selectedEmployeeCode,
      deviceIds: selectedDevices,
    };

    this.commonService.updateEmployeeDeviceAccess(payload).subscribe({
      next: () => {
        this.deviceList = this.deviceList.map((d) => {
          if (d.deviceId === deviceId) {
            return { ...d, status: !d.status };
          }
          return d;
        });

        this.applySearchFilter();
      },
    });

    //  const current = this.deviceList.find((e) => e.deviceId === deviceId);
    // if (!current) return;

    // const oldStatus = current.status;
    // current.status = !current.status;

    // const  selectedDevices = this.deviceList
    //   .filter((e) => e.status === true)
    //   .map((e) => e.deviceId);

    // const payload = {
    //   employeeCode: this.selectedEmployeeCode,
    //   deviceIds: selectedDevices,
    //  };

    // this.commonService.updateDeviceWiseEmoployeeAccess(payload).subscribe({
    //   next: () => {
    //     this.isLoading = false;
    //     this.applySearchFilter();
    //   },
    //   error: () => {
    //     current.status = oldStatus;
    //   },
    // });
  }

  handleAction(data: any) {
    if (data.status === false) {
      this.selectedRowData = data;

      const modal = new (window as any).bootstrap.Modal(
        document.getElementById('deviceModal'),
      );
      modal.show();
    } else {
      this.updateAccess(data.deviceId);
    }
  }

  // handleAction(data: any) {
  // if (data.status === false) {
  //   //  Link button click (open popup)
  //   this.selectedRowData = data;

  //   // default values set
  //   this.assignForm.deviceId = data.deviceId;
  //   this.assignForm.employeeId = this.selectedEmployeeCode;
  //   this.assignForm.expiryDate = '';

  //   const modal = new (window as any).bootstrap.Modal(
  //     document.getElementById('deviceModal')
  //   );
  //   modal.show();

  // } else {
  //   // DLink
  //   this.updateAccess(data.deviceId);
  // }
  // }

  formatDateToISO(date: string): string {
    const selectedDate = new Date(date);
    return selectedDate.toISOString();
  }

  submitAssignDevice() {
    const payload = {
      employeeId: this.assignForm.employeeId,
      deviceId: this.assignForm.deviceId,
      expiryDate: this.formatDateToISO(this.assignForm.expiryDate),
    };

    this.commonService.assignEmployeeDevice(payload).subscribe({
      next: (res: any) => {
        console.log(res);

        //  close modal
        const modalEl = document.getElementById('deviceModal');
        const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        //  reload data
        this.loadDevices();
      },
    });
  }

  // employeewithDevice: any[] = [];
  // deviceList: any[] = [];
  // filteredDeviceList: any[] = [];
  // selectedRowData: any = null;
  // isLoading: boolean = false;

  // assignForm = {
  //   employeeId: 0,
  //   deviceId: 0,
  //   expiryDate: ''
  // };

  // selectedEmployeeCode: string = '';
  // searchText: string = '';
  // selectedFilter: string = '';

  // tableHeading: any;

  // pagesize = {
  //   limit: 25,
  //   offset: 1,
  //   count: 0,
  // };

  // deviceOptions = [
  //   { label: 'All', value: '' },
  //   { label: 'Link', value: 'true' },
  //   { label: 'DLink', value: 'false' },
  // ];

  // constructor(private commonService: CommmonService) {}

  // ngOnInit() {
  //   this.getEmployeeList();
  //   this.setInitialValue();
  // }

  // setInitialValue() {
  //   this.tableHeading = [
  //     { key: 'Sno.', title: 'S No.' },
  //     { key: 'deviceId', title: 'Device ID' },
  //     { key: 'deviceFName', title: 'Device Full Name' },
  //     { key: 'link', title: 'Link' },
  //     { key: 'action', title: 'Action' },
  //     { key: 'expiry', title: 'Expiry' },
  //   ];
  // }

  // get startValue(): number {
  //   return this.pagesize.offset * this.pagesize.limit - (this.pagesize.limit - 1);
  // }

  // get lastValue(): number {
  //   return Math.min(this.startValue + this.pagesize.limit - 1, this.pagesize.count);
  // }

  // getEmployeeList() {
  //   this.commonService.employeeList().subscribe((res: any) => {
  //     this.employeewithDevice = res?.body?.data?.data || [];
  //   });
  // }

  // onSelectEmployee(event: any) {
  //   this.selectedEmployeeCode = event.target.value;
  //   this.pagesize.offset = 1;
  //   this.loadDevices();
  // }

  // loadDevices() {
  //   if (!this.selectedEmployeeCode) {
  //     this.deviceList = [];
  //     this.filteredDeviceList = [];
  //     this.pagesize.count = 0;
  //     return;
  //   }

  //   let link: any = null;

  //   if (this.selectedFilter === 'true') link = true;
  //   else if (this.selectedFilter === 'false') link = false;
  //   else link = undefined;

  //   this.commonService
  //     .getEmployeeWiseDevice(
  //       this.selectedEmployeeCode,
  //       this.pagesize.offset,
  //       this.pagesize.limit,
  //       link
  //     )
  //     .subscribe((res: any) => {
  //       this.deviceList = res.body?.devices || [];
  //       this.applySearchFilter();
  //     });
  // }

  // onSearch(event: any) {
  //   this.searchText = event.target.value.toLowerCase();
  //   this.pagesize.offset = 1;
  //   this.applySearchFilter();
  // }

  // onFilterChange(event: any) {
  //   this.selectedFilter = event.target.value;
  //   this.pagesize.offset = 1;
  //   this.loadDevices();
  // }

  // applySearchFilter() {
  //   let tempList = [...this.deviceList];

  //   if (this.searchText) {
  //     tempList = tempList.filter((item: any) =>
  //       Object.values(item || {}).some((val) =>
  //         val?.toString().toLowerCase().includes(this.searchText)
  //       )
  //     );
  //   }

  //   this.filteredDeviceList = tempList;
  //   this.pagesize.count = tempList.length;
  // }

  // onTablePageChange(event: number) {
  //   this.pagesize.offset = event;
  //   this.loadDevices();
  // }

  // onPageSizeChange(event: any) {
  //   this.pagesize.limit = +event.target.value;
  //   this.pagesize.offset = 1;
  //   this.loadDevices();
  // }

  // updateAccess(deviceId: number) {
  //   let selectedDevices = this.deviceList
  //     .filter((d) => d.status)
  //     .map((d) => d.deviceId);

  //   if (selectedDevices.includes(deviceId)) {
  //     selectedDevices = selectedDevices.filter((id) => id !== deviceId);
  //   } else {
  //     selectedDevices.push(deviceId);
  //   }

  //   const payload = {
  //     employeeCode: this.selectedEmployeeCode,
  //     deviceIds: selectedDevices,
  //   };

  //   this.commonService.updateEmployeeDeviceAccess(payload).subscribe(() => {
  //     this.deviceList = this.deviceList.map((d) =>
  //       d.deviceId === deviceId ? { ...d, status: !d.status } : d
  //     );
  //     this.applySearchFilter();
  //   });
  // }

  // //  OPEN MODAL
  // handleAction(data: any) {
  //   if (!data.status) {
  //     this.selectedRowData = data;

  //     this.assignForm.deviceId = data.deviceId;
  //        this.assignForm.employeeId = Number(this.selectedEmployeeCode);
  //     // this.assignForm.deviceName = data.deviceFName;
  //     this.assignForm.expiryDate = '';

  //     const modal = new bootstrap.Modal(
  //       document.getElementById('deviceModal')
  //     );
  //     modal.show();
  //   } else {
  //     this.updateAccess(data.deviceId);
  //   }
  // }

  // formatDateToISO(date: string): string {
  //   return new Date(date).toISOString();
  // }

  // //  SUBMIT
  // submitAssignDevice() {
  //   const payload = {
  //     employeeId: this.assignForm.employeeId,
  //     deviceId: this.assignForm.deviceId,
  //     expiryDate: this.formatDateToISO(this.assignForm.expiryDate)
  //   };

  //   this.commonService.assignEmployeeDevice(payload).subscribe(() => {
  //     const modal = bootstrap.Modal.getOrCreateInstance(
  //       document.getElementById('deviceModal')
  //     );
  //     modal.hide();

  //     this.loadDevices();
  //   });
  // }
}
