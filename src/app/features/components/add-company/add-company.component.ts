import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'],
})
export class AddCompanyComponent {
  
  constructor(private commonService: CommmonService) { }

  employee = {

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

 // dropdown List
  companyList: any[] = [];
  departmentList: any[] = [];
  locationList: any[] = [];
  designationList: any[] = [];


  ngOnInit() {
    this.getCompanies();
    this.getDepartments();
    this.getLocations();
    this.getDesignations();
  }

  // company List
  getCompanies() {
    this.commonService.getCompanyList().subscribe({
      next: (res: any) => {
        console.log('Company List => ', res);
        this.companyList = res?.body?.data || [];
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  // department List
  getDepartments() {
    this.commonService.getDepartmentList().subscribe({
      next: (res: any) => {
        console.log('Department List => ', res);
        this.departmentList = res?.body?.data || [];
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

// location list
  getLocations() {
    this.commonService.getLocationList().subscribe({
      next: (res: any) => {
        console.log('Location List => ', res);
        this.locationList = res?.body?.data || [];
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

// designation List
  getDesignations() {
    this.commonService.getDesignationList().subscribe({
      next: (res: any) => {
        console.log('Designation List => ', res);
        this.designationList = res?.body?.data || [];
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

// save Employee
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
        console.log('Employee Added => ', res);
        alert('Employee Added Successfully');
        this.resetForm();
      },
      error: (err) => {
        console.log(err);
        alert('Something went wrong');
      }

    });

  }

  // ================= RESET FORM =================

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

      DOR: '',

    }
  }
}
