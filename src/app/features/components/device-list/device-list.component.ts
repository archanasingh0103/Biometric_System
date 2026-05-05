import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-device-list',
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css',
})
export class DeviceListComponent {
  deviceList: any[] = [];
  tableHeading: any;
  filteredList: any[] = [];
  isLoading: boolean = false;

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };
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

  constructor(private commonService: CommmonService) {}
  ngOnInit() {
    this.setInitialDeviceTable();
    this.getDeviceList();
  }

  // Table headings
  setInitialDeviceTable() {
    this.tableHeading = [
      { key: 'Sno', title: 'S.No.' },
      { key: 'deviceId', title: 'Device Id' },
      { key: 'deviceFName', title: 'Device Full Name' },
      { key: 'deviceSName', title: 'Device Short Name' },
      { key: 'deviceDirection', title: 'Device Direction' },
      { key: 'serialNumber', title: 'Serial Number' },
      { key: 'connectionType', title: 'Connection Type' },
      { key: 'ipAddress', title: 'IP Address' },
      { key: 'lastLogDownloadDate', title: 'Last Log Download Date' },
    ];
  }

  getDeviceList() {
    this.commonService
      .deviceList(this.pagesize.offset, this.pagesize.limit)
      .subscribe((res: any) => {
       console.log("Device List:",res);
       


        this.isLoading = false;

        this.deviceList = res?.body.data || [];
        this.filteredList = [...this.deviceList];
        this.pagesize.count = res?.body.totalRecords || 0;
      });
  }

  // Pagination Change
  onTablePageChange(event: number) {
    this.pagesize.offset = event;
    this.getDeviceList();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.getDeviceList();
  }

  // SEARCH
  onSearch(event: any) {
    // this.searchText = event.target.value.toLowerCase();
    this.pagesize.offset = 1;
  }
}
