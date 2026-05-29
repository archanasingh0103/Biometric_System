import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-company',
  imports: [NgxPaginationModule, FormsModule, CommonModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css',
})
export class CompanyComponent {
  comapnyList: any[] = [];
  filteredList: any[] = [];
  isLoading: boolean = false;
  searchText = '';

  tableHeading = [
    { key: 'Sno', title: 'S.No.' },
    { key: 'companyFName', title: 'Company FName' },
    { key: 'companySName', title: 'Company SName' },
    { key: 'companyAddress', title: 'Company Address' },
    { key: 'companyeMail', title: 'Company Email' },
    { key: 'companyWebsite', title: 'Company Website' },
    { key: 'recordStatus', title: 'Record Status' },
    { key: 'action', title: 'Action' },
  ];

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  company = {
    companyId: 0,
    companyFName: '',
    companySName: '',
    companyAddress: '',
    companyIsVisible: 1,
    companyeMail: '',
    companyWebsite: '',
    recordStatus: 0,
    isMetro: 0,
    responsiblePerson: '',
  };

  constructor(
    private commonService: CommmonService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getComapnyList();
  }

  getComapnyList() {
    this.isLoading = true;

    this.commonService
      .newCompanyList(
        this.pagesize.offset,
        this.pagesize.limit,
        this.searchText,
      )
      .subscribe({
        next: (res: any) => {
          console.log('Company List:', res);
          this.comapnyList = res?.body?.data || [];
          this.filteredList = [...this.comapnyList];
          this.pagesize.count = this.comapnyList.length;
          this.isLoading = false;
        },

        error: (err: any) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  get startValue(): number {
    return (this.pagesize.offset - 1) * this.pagesize.limit + 1;
  }

  get lastValue(): number {
    const last = this.startValue + this.comapnyList.length - 1;

    return Math.min(last, this.pagesize.count);
  }
  onSearch(event: any) {
    this.searchText = event.target.value;
    this.getComapnyList();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.getComapnyList();
  }

  onTablePageChange(page: number) {
    this.pagesize.offset = page;
    this.getComapnyList();
  }

  resetForm() {
    this.company = {
      companyId: 0,
      companyFName: '',
      companySName: '',
      companyAddress: '',
      companyIsVisible: 1,
      companyeMail: '',
      companyWebsite: '',
      recordStatus: 0,
      isMetro: 0,
      responsiblePerson: '',
    };
  }

  openAddForm() {
    const payload = {
      companyFName: this.company.companyFName,
      companySName: this.company.companySName,
      companyAddress: this.company.companyAddress,
      companyIsVisible: this.company.companyIsVisible,
      companyeMail: this.company.companyeMail,
      companyWebsite: this.company.companyWebsite,
      recordStatus: this.company.recordStatus,
      isMetro: this.company.isMetro,
      responsiblePerson: this.company.responsiblePerson,
    };

    console.log('Add Company Payload:', payload);

    this.commonService.addCompany(payload).subscribe({
      next: (res: any) => {
        console.log('Add Company:', res);

        const responseData = res?.body || res;

        if (responseData?.isSuccess) {
          this.toastr.success('Company Added Successfully');

          this.getComapnyList();

          this.resetForm();
        } else {
          // alert(responseData?.message || 'Something went wrong');
          this.toastr.warning(responseData?.message || 'Something went wrong');
        }
      },
      error: (err: any) => {
        console.log('API Error:', err);
        this.toastr.error('API Error');
      },
    });
  }

  editData(data: any) {
    console.log('Edit Data:', data);
    this.company = {
      companyId: data.companyId,
      companyFName: data.companyFName,
      companySName: data.companySName,
      companyAddress: data.companyAddress,
      companyIsVisible: data.companyIsVisible,
      companyeMail: data.companyeMail,
      companyWebsite: data.companyWebsite,
      recordStatus: data.recordStatus,
      isMetro: data.isMetro,
      responsiblePerson: data.responsiblePerson,
    };

    // OPEN MODAL
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('companyModal'),
    );

    modal.show();
  }

  updateCompanyData() {
    const payload = {
      companyId: this.company.companyId,
      companyFName: this.company.companyFName,
      companySName: this.company.companySName,
      companyAddress: this.company.companyAddress,
      companyIsVisible: this.company.companyIsVisible,
      companyeMail: this.company.companyeMail,
      companyWebsite: this.company.companyWebsite,
      recordStatus: this.company.recordStatus,
      isMetro: this.company.isMetro,
      responsiblePerson: this.company.responsiblePerson,
    };

    console.log('Update Payload:', payload);

    this.commonService.updateCompany(payload).subscribe({
      next: (res: any) => {
        console.log('Update Response:', res);

        const responseData = res?.body;

        if (responseData?.isSuccess) {
          this.toastr.success('Company Updated Successfully');

          this.getComapnyList();

          this.resetForm();
        } else {
         this.toastr.warning(responseData?.message || 'Something went wrong');
        }
      },
      error: (err: any) => {
        console.log('Update Error:', err);
      },
    });
  }

  // DELETE
  deleteData(data: any) {
    console.log('Delete Data:', data);
    const isConfirm = confirm(
      `Are you sure you want to delete ${data.companyFName} ?`,
    );
    if (!isConfirm) {
      return;
    }
    this.commonService.deleteCompany(data.companyId).subscribe({
      next: (res: any) => {
        console.log('Delete Response:', res);
        const responseData = res?.body || res;
        if (responseData?.isSuccess) {
          this.toastr.success('Company Deleted Successfully');
          // refresh list
          this.getComapnyList();
        } else {
          this.toastr.warning(responseData?.message || 'Something went wrong');
        }
      },
      error: (err: any) => {
        console.log('Delete Error:', err);

        this.toastr.error('API Error');
      },
    });
  }
}
