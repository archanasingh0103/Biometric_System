import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-company',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css',
})
export class AddCompanyComponent {
  constructor(private commonService: CommmonService) {}

// employee key
  employee: any = {
    StaffCode: '',
    StaffName: '',

    Gender: 'Male',
    Status: 'Working',

    CompanySName: '',
    DepartmentSName: '',
    Location: '',
    Designation: '',

    Grade: 'Default',
    Team: 'Default',

    DOJ: '',
    DOC: '',
    DOB: '',
    DOR: '',
  };

// Dropdown List
  companyList: any[] = [];
  departmentList: any[] = [];
  locationList: any[] = [];
  designationList: any[] = [];

// employee list
  employeeList: any[] = [];

  ngOnInit(): void {
    this.getCompanies();
    this.getDepartments();
    this.getLocations();
    this.getDesignations();

    this.getEmployees();
  }

  // get company list
  getCompanies() {
    this.commonService.getCompanyList().subscribe({
      next: (res: any) => {
        console.log('Company List:', res);

        this.companyList = res?.data || res || [];
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  // get department list
  getDepartments() {
    this.commonService.getDepartmentList().subscribe({
      next: (res: any) => {
        console.log('Department List:', res);

        this.departmentList = res?.data || res || [];
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  // get location list
  getLocations() {
    this.commonService.getLocationList().subscribe({
      next: (res: any) => {
        console.log('Location List:', res);

        this.locationList = res?.data || res || [];
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  // get designation list
  getDesignations() {
    this.commonService.getDesignationList().subscribe({
      next: (res: any) => {
        console.log('Designation List:', res);

        this.designationList = res?.data || res || [];
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  // get employee list
  getEmployees() {
    this.commonService.employeeList(1, 1000).subscribe({
      next: (res: any) => {
        console.log('Employee List:', res);

        this.employeeList = res?.data || [];
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  //save employee
  saveEmployee() {
    const payload = {
      StaffCode: this.employee.StaffCode,
      StaffName: this.employee.StaffName,
      Gender: this.employee.Gender,
      Status: this.employee.Status,
      CompanySName: this.employee.CompanySName,
      DepartmentSName: this.employee.DepartmentSName,
      Location: this.employee.Location,
      Designation: this.employee.Designation,
      Grade: this.employee.Grade,
      Team: this.employee.Team,
      DOJ: this.employee.DOJ,
      DOC: this.employee.DOC,
      DOB: this.employee.DOB,
      DOR: this.employee.DOR,
    };

    console.log('Payload:', payload);

    this.commonService.addEmployee(payload).subscribe({
      next: (res: any) => {
        console.log('Employee Added:', res);

        alert('Employee Added Successfully');

        this.getEmployees();

        this.resetForm();
      },

      error: (err) => {
        console.log(err);

        alert('Something went wrong');
      },
    });
  }

  // resest form
  resetForm() {
    this.employee = {
      StaffCode: '',

      StaffName: '',

      Gender: 'Male',

      Status: 'Working',

      CompanySName: '',

      DepartmentSName: '',

      Location: '',

      Designation: '',

      Grade: 'Default',

      Team: 'Default',

      DOJ: '',

      DOC: '',

      DOB: '',

      DOR: '3000-01-01',
    };
  }
}
