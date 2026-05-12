import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  fromDate: string = '';
  toDate: string = '';
  ngOnInit(): void {
    this.setInitialDeviceTable();

    // load complete list initially
    this.getExpiringSoonList();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

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

  getExpiringSoonList() {
    this.isLoading = true;

    this.commonService
      .expiringSoonList(
        this.fromDate || '',
        this.toDate || '',
        this.pagesize.offset,
        this.pagesize.limit,
      )
      .subscribe({
        next: (res: any) => {
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

  // onShowClick() {
  //   if (!this.fromDate || !this.toDate) {
  //     alert("Please select From and To date");
  //     return;
  //   }

  //   this.pagesize.offset = 1; // reset pagination
  //   this.getExpiringSoonList();
  // }
  onShowClick() {
    if (!this.fromDate || !this.toDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Date',
        text: 'Please select From and To date',
        confirmButtonText: 'OK',
      });

      return;
    }

    console.log('API CALL');
    this.pagesize.offset = 1; // reset pagination
    this.getExpiringSoonList();
  }

  // Pagination Change
  onTablePageChange(event: number) {
    this.pagesize.offset = event;
    this.getExpiringSoonList();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.getExpiringSoonList();
  }
}
