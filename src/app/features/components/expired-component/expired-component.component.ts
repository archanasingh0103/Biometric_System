import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expired-component',
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './expired-component.component.html',
  styleUrl: './expired-component.component.css',
})
export class ExpiredComponentComponent {
  expiredList: any[] = [];
  tableHeading: any;
  filteredList: any[] = [];
  isLoading: boolean = false;
  days: number = 30;

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
      { key: 'idd', title: 'Employee Id' },
      { key: 'name', title: 'Name' },
      { key: 'deviceId', title: 'Device ID' },
      { key: 'validToDate', title: 'Expiry Date' },
    ];
  }

  getDeviceList() {
    this.isLoading = true;

    this.commonService
      .expiringSoonList(this.days, this.pagesize.offset, this.pagesize.limit)
      .subscribe({
        next: (res: any) => {
          console.log('Expired Device List:', res);

          const response = res?.body;

          this.expiredList = response?.data || [];

          this.filteredList = [...this.expiredList];

          this.pagesize.count = response?.totalRecords || 0;

          this.isLoading = false;
        },

        error: (err) => {
          console.error(err);

          this.isLoading = false;
        },
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
}
