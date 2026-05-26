import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bulk-activity',
  imports: [NgxPaginationModule, FormsModule, CommonModule],
  templateUrl: './bulk-activity.component.html',
  styleUrl: './bulk-activity.component.css',
})
export class BulkActivityComponent {
  deviceList: any[] = [];
  filteredList: any[] = [];
  tableHeading: any;

  isLoading: boolean = false;

  // CHECKBOX
  selectedDevices: any[] = [];
  isAllSelected = false;

  // ACTION
  selectedAction = '';

  // FILE
  selectedFile!: File;

  // EXCEL
  isExcelLoading = false;

  // STORE UPLOAD RESPONSE
  uploadResponseData: any = null;

  // ACTION OPTIONS
  actionOptions = [
    { label: 'Access', value: 'access' },
    { label: 'DLink', value: 'dlink' },
    { label: 'Block', value: 'block' },
  ];

  // PAGINATION
  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  // ================= GETTERS =================

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

  // ================= CONSTRUCTOR =================

  constructor(private commonService: CommmonService) {}

  // ================= INIT =================

  ngOnInit() {
    this.setInitialDeviceTable();
    this.getDeviceList();
  }

  // ================= TABLE HEADERS =================

  setInitialDeviceTable() {
    this.tableHeading = [
      {
        key: 'Sno',
        title: 'S.No.',
      },
      {
        key: 'deviceFName',
        title: 'Device Full Name',
      },
    ];
  }

  // ================= DEVICE LIST =================

  getDeviceList() {
    this.isLoading = true;

    this.commonService
      .deviceList(this.pagesize.offset, this.pagesize.limit)
      .subscribe({
        next: (res: any) => {
          console.log('Device List:', res);

          this.isLoading = false;

          this.deviceList = res?.body?.data || [];

          this.filteredList = [...this.deviceList];

          this.pagesize.count = res?.body?.totalRecords || 0;
        },

        error: (err: any) => {
          this.isLoading = false;

          console.log(err);
        },
      });
  }

  // ================= PAGINATION =================

  onTablePageChange(event: number) {
    this.pagesize.offset = event;

    this.getDeviceList();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;

    this.pagesize.offset = 1;

    this.getDeviceList();
  }

  // ================= CHECKBOX =================

  isChecked(device: any): boolean {
    return this.selectedDevices.some((x) => x.deviceId === device.deviceId);
  }

  onCheckboxChange(event: any, device: any) {
    if (event.target.checked) {
      this.selectedDevices.push(device);
    } else {
      this.selectedDevices = this.selectedDevices.filter(
        (x) => x.deviceId !== device.deviceId,
      );
    }

    this.isAllSelected =
      this.selectedDevices.length === this.filteredList.length;
  }

  toggleSelectAll(event: any) {
    this.isAllSelected = event.target.checked;

    if (this.isAllSelected) {
      this.selectedDevices = [...this.filteredList];
    } else {
      this.selectedDevices = [];
    }
  }

  // ================= FILE SELECT =================

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      console.log('Selected File:', file);

      // AUTO UPLOAD
      this.uploadExcel();
    }
  }

  // ================= UPLOAD EXCEL =================

  //   uploadExcel() {
  //     // FILE CHECK
  //     if (!this.selectedFile) {
  //       alert('Please select excel file');

  //       return;
  //     }

  //     // ACTION CHECK
  //     if (!this.selectedAction) {
  //       alert('Please select action');

  //       return;
  //     }

  //     // DEVICE CHECK
  //     if (!this.selectedDevices.length) {
  //       alert('Please select atleast one device');

  //       return;
  //     }

  //     // FORM DATA
  //     const formData = new FormData();

  //     // ACTION VALUE
  //     let actionValue = '';

  //     // ACCESS
  //     if (this.selectedAction === 'access') {
  //       actionValue = 'A';
  //     }

  //     // DLINK
  //     else if (this.selectedAction === 'dlink') {
  //       actionValue = 'D';
  //     }

  //     // BLOCK
  //     else if (this.selectedAction === 'block') {
  //       actionValue = 'B';
  //     }

  //     // APPEND ACTION
  //     formData.append('Action', actionValue);

  //     // APPEND DEVICES
  //     // this.selectedDevices.forEach((device: any) => {
  //     //   formData.append('Devices', device.serialNumber?.toString() || '');
  //     // });

  //     this.selectedDevices.forEach((device: any) => {

  //   console.log('Selected Device:', device);

  //   console.log('Serial Number:', device.serialNumber);

  //   // NULL CHECK
  //   if (device.serialNumber) {

  //     formData.append(
  //       'Devices',
  //       device.serialNumber.toString().trim()
  //     );

  //   }

  // });

  //     // APPEND FILE
  //     formData.append('File', this.selectedFile);

  //     // DEBUG
  //     console.log('======= FORM DATA =======');

  //     formData.forEach((value, key) => {
  //       console.log(key, value);
  //     });

  //     // API CALL
  //     this.commonService.uploadExcel(formData).subscribe({
  //       next: (res: any) => {
  //         console.log('Upload Response:', res);

  //         // RESPONSE
  //         const response = res?.body;

  //         // SAVE RESPONSE
  //         this.uploadResponseData = response;

  //         // SUCCESS
  //         if (response?.status || response?.isSuccess) {
  //           alert(
  //             `Upload Completed

  // Inserted : ${response?.totalInserted || 0}

  // Duplicate : ${response?.totalDuplicate || 0}`,
  //           );

  //           // DUPLICATE DATA
  //           console.log('Duplicate Data:', response?.duplicateData);

  //           // REFRESH TABLE
  //           this.getDeviceList();

  //           // RESET FILE
  //           this.selectedFile = null as any;
  //         } else {
  //           alert(response?.message || 'Upload Failed');
  //         }
  //       },

  //       error: (err: any) => {
  //         console.log('Upload Error:', err);

  //         alert('Upload Failed');
  //       },
  //     });
  //   }
  // ================= UPLOAD EXCEL =================

  uploadExcel() {
    // FILE CHECK
    if (!this.selectedFile) {
      alert('Please select excel file');

      return;
    }

    // ACTION CHECK
    if (!this.selectedAction) {
      alert('Please select action');

      return;
    }

    // DEVICE CHECK
    if (!this.selectedDevices.length) {
      alert('Please select atleast one device');

      return;
    }

    // FORM DATA
    const formData = new FormData();

    // ACTION VALUE
    let actionValue = '';

    // ACCESS
    if (this.selectedAction === 'access') {
      actionValue = 'A';
    }

    // DLINK
    else if (this.selectedAction === 'dlink') {
      actionValue = 'D';
    }

    // BLOCK
    else if (this.selectedAction === 'block') {
      actionValue = 'B';
    }

    // APPEND ACTION
    formData.append('Action', actionValue);

    // ================= DEVICES =================

    this.selectedDevices.forEach((device: any) => {
      console.log('Selected Device:', device);

      // TRY DIFFERENT POSSIBLE VALUES
      const deviceValue =
        device.serialNumber || device.machineId || device.deviceId;

      console.log('Sending Device Value:', deviceValue);

      // NULL / EMPTY CHECK
      if (deviceValue && deviceValue !== '0') {
        formData.append('Devices', deviceValue.toString().trim());
      }
    });

    // APPEND FILE
    formData.append('File', this.selectedFile);

    // ================= DEBUG =================

    console.log('======= FINAL FORM DATA =======');

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // ================= API CALL =================

    this.commonService.uploadExcel(formData).subscribe({
      next: (res: any) => {
        console.log('Upload Response:', res);

        // RESPONSE BODY
        const response = res?.body;

        // SAVE RESPONSE
        this.uploadResponseData = response;

        // SUCCESS
        if (response?.status || response?.isSuccess) {
          alert(
            `Upload Completed

Inserted : ${response?.totalInserted || 0}

Duplicate : ${response?.totalDuplicate || 0}`,
          );

          // DUPLICATE DATA
          console.log('Duplicate Data:', response?.duplicateData);

          // REFRESH TABLE
          this.getDeviceList();

          // RESET FILE
          this.selectedFile = null as any;
        }

        // FAILED
        else {
          console.log('API MESSAGE:', response?.message);

          alert(response?.message || 'Upload Failed');
        }
      },

      error: (err: any) => {
        console.log('Upload Error:', err);

        alert('Upload Failed');
      },
    });
  }

  // ================= DOWNLOAD EXCEL =================

  downloadExcel() {
    // CHECK RESPONSE
    if (!this.uploadResponseData) {
      alert('Please upload excel first');

      return;
    }

    this.isExcelLoading = true;

    try {
      // RESPONSE
      const response = this.uploadResponseData;

      // ACTION TYPE
      let actionType = '';

      if (this.selectedAction === 'access') {
        actionType = 'Access';
      } else if (this.selectedAction === 'dlink') {
        actionType = 'DLink';
      } else if (this.selectedAction === 'block') {
        actionType = 'Block';
      }

      // DUPLICATE DATA
      const duplicateData = response?.duplicateData || [];

      // EXCEL DATA
      const excelData = duplicateData.map((item: any, index: number) => ({
        'S.No': index + 1,

        'Action Type': actionType,

        'Request Number': response?.requestNumber || '',

        // 'Duplicate Message': item,
      }));

      // SHEET
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

      // COLUMN WIDTH
      ws['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 30 }, { wch: 60 }];

      // WORKBOOK
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'Bulk Activity Report');

      // DOWNLOAD
      XLSX.writeFile(wb, 'Bulk_Activity_Report.xlsx');

      this.isExcelLoading = false;
    } catch (error) {
      this.isExcelLoading = false;

      console.log(error);
    }
  }
}
