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
  tableHeading: any;
  searchKeyword: string = '';

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  constructor(private commonService: CommmonService) {}

  ngOnInit() {
    this.setInitialEmplyeeTable();
    this.getEmployeeList();
  }

  setInitialEmplyeeTable() {
    this.tableHeading = [
      { key: 'Sno', title: 'S.No.' },
      { key: 'employeeName', title: 'Employee Name' },
      { key: 'employeeCode', title: 'Employee Code' },
      { key: 'numericCode', title: 'Numeric Code' },
      { key: 'gender', title: 'Gender' },
      { key: 'companyId', title: 'CompanyId' },
      { key: 'designation', title: 'Designation' },
    ];
  }

  //API CALL
  getEmployeeList() {
    this.commonService.employeeList().subscribe((res: any) => {
    console.log("Employee List:",res);
    

      this.isLoading = false;
      this.employeeList = res?.body?.data || [];
      this.pagesize.count = res?.body?.data?.totalRecords || 0;

      this.applyFilter();
    });
  }

  // Search
  onSearch(event: any) {
    this.searchKeyword = event.target.value.toLowerCase();
    this.pagesize.offset = 1;
    this.applyFilter();
  }

  // Filter
  applyFilter() {
    if (!this.searchKeyword) {
      this.filteredEmployeeList = [...this.employeeList];
    } else {
      this.filteredEmployeeList = this.employeeList.filter((item: any) =>
        Object.values(item).some((val) =>
          val?.toString().toLowerCase().includes(this.searchKeyword),
        ),
      );
    }

    this.pagesize.count = this.filteredEmployeeList.length;
  }

  // Page Change
  onTablePageChange(event: number) {
    this.pagesize.offset = event;
  }

  // Page Size Change
  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
  }

  // Counting
  get startValue(): number {
    return (
      this.pagesize.offset * this.pagesize.limit - (this.pagesize.limit - 1)
    );
  }

  get lastValue(): number {
    const last = this.startValue + this.pagesize.limit - 1;
    return Math.min(last, this.pagesize.count);
  }
}
