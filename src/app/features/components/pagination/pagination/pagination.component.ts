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

  //  loadDevices() {
  //   if (!this.selectedEmployeeCode) return;

  //   this.isLoading = true;

  //   this.commonService
  //     .getEmployeeWiseDevice(
  //       this.selectedEmployeeCode,
  //       this.searchText,
  //       this.pagesize.offset,
  //       this.pagesize.limit,
  //     )
  //     .subscribe((res: any) => {
  //       this.isLoading = false;

  //     let list = res?.body.data || [];

  //       if (this.selectedFilter !== '') {
  //         list = list.filter(
  //           (x: any) => String(x.Link) === this.selectedFilter,
  //         );
  //       }

  //       if (this.searchText) {
  //         const txt = this.searchText.toLowerCase();

  //         list = list.filter(
  //           (x: any) =>
  //             x.DeviceName?.toLowerCase().includes(txt) ||
  //             x.SerialNumber?.toLowerCase().includes(txt),
  //         );
  //       }

  //       //  IMPORTANT CHANGE: NO UTC conversion
  //       list = list.map((x: any) => {
  //         if (!x.ValidToDate) {
  //           return { ...x, ValidToDate: null };
  //         }

  //         const date = new Date(x.ValidToDate);

  //         if (isNaN(date.getTime())) {
  //           return { ...x, ValidToDate: null };
  //         }

  //         return {
  //           ...x,
  //           ValidToDate: date, 
  //         };
  //       });

  //       this.filteredDeviceList = list;
  //       this.pagesize.count = list[0]?.TotalCount || list.length;
  //     });
  // }
}
