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
  tableHeading: any;
  filteredList: any[] = [];
  isLoading: boolean = false;

  // CHECKBOX
  selectedDevices: any[] = [];
  isAllSelected = false;

  // ACTION DROPDOWN
  selectedAction = '';

  // EXCEL
  isExcelLoading = false;
  selectedFile!: File;

  actionOptions = [
    { label: 'Access', value: 'access' },
    { label: 'DLink', value: 'dlink' },
    { label: 'Block', value: 'block' },
  ];

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  get startValue(): number {
    return (
      this.pagesize.offset * this.pagesize.limit -
      (this.pagesize.limit - 1)
    );
  }

  get lastValue(): number {
    return Math.min(
      this.startValue + this.pagesize.limit - 1,
      this.pagesize.count
    );
  }

  constructor(private commonService: CommmonService) {}

  ngOnInit() {
    this.setInitialDeviceTable();
    this.getDeviceList();
  }

  // TABLE HEADINGS
  setInitialDeviceTable() {
    this.tableHeading = [
      { key: 'Sno', title: 'S.No.' },
      { key: 'deviceFName', title: 'Device Full Name' },
    ];
  }

  // DEVICE LIST API
  getDeviceList() {
    this.commonService
      .deviceList(this.pagesize.offset, this.pagesize.limit)
      .subscribe((res: any) => {
        console.log('Device List:', res);

        this.isLoading = false;

        this.deviceList = res?.body.data || [];
        this.filteredList = [...this.deviceList];
        this.pagesize.count = res?.body.totalRecords || 0;
      });
  }

  // PAGINATION
  onTablePageChange(event: number) {
    this.pagesize.offset = event;
    this.getDeviceList();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.getDeviceList();
  }

  // CHECKBOX FUNCTIONS
  isChecked(device: any): boolean {
    return this.selectedDevices.some(
      (x) => x.deviceId === device.deviceId
    );
  }

  onCheckboxChange(event: any, device: any) {
    if (event.target.checked) {
      this.selectedDevices.push(device);
    } else {
      this.selectedDevices = this.selectedDevices.filter(
        (x) => x.deviceId !== device.deviceId
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

  // EXCEL DOWNLOAD
  async downloadExcel() {
    this.isExcelLoading = true;

    try {
      this.commonService
        .deviceList(1, this.pagesize.count || 1000)
        .subscribe((res: any) => {
          this.isExcelLoading = false;

          const data = res?.body?.data || [];

          if (!data.length) {
            console.log('No data for excel');
            return;
          }

          const excelData = data.map(
            (item: any, index: number) => ({
              'S.No': index + 1,

              'Device ID': item?.deviceId || 'NA',

              'Device Full Name':
                item?.deviceFName || 'NA',

              'Device Short Name':
                item?.deviceSName || 'NA',

              'Device Direction':
                item?.deviceDirection || 'NA',

              'Serial Number':
                item?.serialNumber || 'NA',

              'Connection Type':
                item?.connectionType || 'NA',

              'IP Address':
                item?.ipAddress || 'NA',

              'Last Log Download':
                item?.lastLogDownloadDate || 'NA',
            })
          );

          // SHEET
          const ws =
            XLSX.utils.json_to_sheet(excelData);

          // COLUMN WIDTH
          ws['!cols'] = [
            { wch: 8 },
            { wch: 15 },
            { wch: 30 },
            { wch: 25 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 25 },
          ];

          // WORKBOOK
          const wb = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            wb,
            ws,
            'Device List'
          );

          // DOWNLOAD
          XLSX.writeFile(
            wb,
            'Device_List_Report.xlsx'
          );
        });
    } catch (error) {
      this.isExcelLoading = false;

      console.log(error);
    }
  }

  // FILE SELECT
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      console.log('Selected File:', file);

      this.uploadExcel();
    }
  }

  // =========================
  // UPLOAD EXCEL
  // =========================

  uploadExcel() {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();

    formData.append('file', this.selectedFile);

    this.commonService.uploadExcel(formData).subscribe({
      next: (res: any) => {
        console.log('Upload Response:', res);

        alert(`
Inserted: ${res.totalInserted}
Duplicate: ${res.totalDuplicate}
        `);

        console.log(
          'Duplicate Employees:',
          res.duplicateEmployees
        );

        // REFRESH TABLE
        this.getDeviceList();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }
}
