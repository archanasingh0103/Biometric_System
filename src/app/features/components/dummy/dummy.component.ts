import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommmonService } from '../../shared/services/common-service/common.service';
@Component({
  selector: 'app-dummy',
  imports: [CommonModule, FormsModule],
  templateUrl: './dummy.component.html',
  styleUrl: './dummy.component.css',
})
export class DummyComponent implements OnInit {
  companyList: any[] = [];
  departmentList: any[] = [];
  locationlist: any[] = [];
  designationList: any[] = [];
  employee: any = {
    StaffCode: '',
    StaffName: '',
    Gender: 'Male',
    Status: '',
    CompanySName: '',
    DepartmentSName: '',
    Location: '',
    Designation: '',
    Grade: '',
    Team: '',
    DOJ: '',
    DOC: '',
    DOB: '',
    DOR: '',
  };

  constructor(private commonService: CommmonService) {}
  ngOnInit() {
    this.getCompanies();
    this.getDepartment();
    this.getLoaction();
    this.getDesignation();
  }

  getCompanies() {
    this.commonService.getCompanyList().subscribe({
      next: (res: any) => {
        console.log("Company List:",res);
        
      },
      error: (err) => {
        console.log(err);  
      },
})
  }
  getDepartment() {
    this.commonService.getDepartmentList().subscribe({
      next: (res: any) => {
        console.log("Deaprtment List:",res);
        
      },
      error: (err) => {
        console.log(err);
      },
    })
  }
  getLoaction() {
    this.commonService.getLocationList().subscribe({
      next: (res: any) => {
         console.log("Loaction List:", res);
      },
      error: (err) => {
        console.log(err);  
      },     
    })
  }
  getDesignation() {
    this.commonService.getDesignationList().subscribe({
      next: (res: any) => {
        console.log("Designation List:",res); 
      },
      error: (err) => {
        console.log(err); 
      }
    })
  }

  getEmployeeList()
  {
    this.commonService.employeeList(1, 1000).subscribe({
      next: (res: any) => {
        console.log("Employee List:", res);  
      },
      error: (err) => {
        console.log(err);
        
      },
    });
  }

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
    console.log("Payload:", payload);
    this.commonService.addEmployee(payload).subscribe({
      next: (res: any) => {
        console.log("Add Employee:",res);
        alert('Employee Added Successfully');
        this.getEmployeeList();
        this.resetForm();
      },
      error: (err) => {
        console.log(err);
        alert('Something went wrong');
      },
    })
  }

 resetForm()
{
   this.employee = {
     StaffCode: '',
     StaffName: '',
     Gender: '',
     Status: '',
     CompanySName: '',
     DepartmentSName: '',
     Location: '',
     Designation: '',
     Grade: '',
     Team: '',
     DOJ: '',
     DOC: '',
     DOB: '',
     DOR:''
  }
  }
}
