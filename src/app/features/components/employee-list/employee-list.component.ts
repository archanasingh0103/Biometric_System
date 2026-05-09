import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  imports: [NgxPaginationModule, FormsModule, CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  employeeList: any[] = [];
  filteredEmployeeList: any[] = [];
  isLoading: boolean = false;

  tableHeading = [
    { key: 'Sno', title: 'S.No.' },
    { key: 'employeeName', title: 'Employee Name' },
    { key: 'employeeCode', title: 'Employee Code' },
    { key: 'employeeId', title: 'Employee Id' },
    { key: 'gender', title: 'Gender' },
    { key: 'companyId', title: 'Company Id' },
    { key: 'designation', title: 'Designation' },
  ];

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  constructor(private commonService: CommmonService) {}

  ngOnInit(): void {
    this.getEmployeeList();
  }

  // GET EMPLOYEE LIST
  getEmployeeList() {
    this.isLoading = true;

    this.commonService
      .employeeList(this.pagesize.offset, this.pagesize.limit)
      .subscribe({
        next: (res: any) => {
          console.log('Employee List:', res);

          this.employeeList = res?.body?.data || [];

         this.filteredEmployeeList=[...this.employeeList]
          this.pagesize.count = res?.body?.totalRecords || 0;

          this.isLoading = false;
        },

        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  // PAGE CHANGE
  onTablePageChange(page: number) {
    this.pagesize.offset = page;
    this.getEmployeeList();
  }

  // PAGE SIZE CHANGE
  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.getEmployeeList();
  }

  // START VALUE
  get startValue(): number {
    return (
      (this.pagesize.offset - 1) * this.pagesize.limit + 1
    );
  }

  // LAST VALUE
  get lastValue(): number {
    const last =
      this.startValue + this.employeeList.length - 1;

    return Math.min(last, this.pagesize.count);
  }
}
