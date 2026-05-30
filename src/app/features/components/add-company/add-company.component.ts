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
  constructor(private commonService: CommmonService) {}
  employee = {
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
    DOR: '',
  };

  genderOptions = [
    {
      label: 'Male',
      value: 'Male',
      class: 'male-label',
    },
    {
      label: 'Female',
      value: 'Female',
      class: 'female-label',
    },
    {
      label: 'Other',
      value: 'Other',
      class: 'other-label',
    },
  ];

  companyList: any[] = [];
  departmentList: any[] = [];
  locationList: any[] = [];
  designationList: any[] = [];
  buttonMessage: string = 'Submit';

  ngOnInit() {
    this.getCompanies();
    this.getDepartments();
    this.getLocations();
    this.getDesignations();
  }

  getCompanies() {
    this.commonService.getCompanyList().subscribe({
      next: (res: any) => {
        console.log('Company List => ', res);
        this.companyList = res?.body?.data || [];
      },
      error: (err) => {
        console.log(err);
      },
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
      },
    });
  }


  getLocations() {
    this.commonService.getLocationList().subscribe({
      next: (res: any) => {
        console.log('Location List => ', res);
        this.locationList = res?.body?.data || [];
      },
      error: (err) => {
        console.log(err);
      },
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
      },
    });
  }

submitButton() {
  this.commonService.requestSuccess().subscribe({
    next: (res: any) => {
      const response = res.body || res;
      console.log("Request Response:", response);
      if (response.isSuccess) {
        this.buttonMessage = response.message;
      }
    },
    error: (err) => {
      console.log(err);
      this.buttonMessage = 'Request Failed';
    },
  });
}
}
