import { Component } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-department',
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent {
 departmentList: any[] = [];
  filteredList: any[] = [];
  isLoading: boolean = false;
  searchText = '';


  tableHeading = [
    { key: 'Sno', title: 'S.No.' },
    { key: 'departmentFName', title: 'department FName' },
    { key: 'departmentSName', title: 'Department SName' },
    { key: 'description', title: 'Description' },
    { key: 'recordStatus', title: 'Record Statusl' },
    { key: 'action', title: 'Action' },
  ];

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  department = {
    departmentId: 0,
    departmentFName: '',
    departmentSName: '',
    description: '',
    recordStatus: 1,
    departmenteMail: '',
  };

  constructor(private commonService: CommmonService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getDepartmentList();
  }

  getDepartmentList() {
    this.isLoading = true;

    this.commonService.departmentList(this.pagesize.offset, this.pagesize.limit,this.searchText,).subscribe({
      next: (res: any) => {
        console.log('Department List:', res);
        this.departmentList = res?.body?.data || [];
        this.filteredList = [...this.departmentList];
        this.pagesize.count = this.departmentList.length;
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
    const last = this.startValue + this.departmentList.length - 1;

    return Math.min(last, this.pagesize.count);
  }
   onSearch(event: any) {
    this.searchText = event.target.value;
    this.getDepartmentList();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.getDepartmentList();
  }

  onTablePageChange(page: number) {
    this.pagesize.offset = page;
    this.getDepartmentList();
  }

  resetForm() {
    this.department = {
      departmentId: 0,
      departmentFName: '',
      departmentSName: '',
      description: '',
      recordStatus: 1,
      departmenteMail: '',
    };
  }

  openAddForm() {
    const payload = {
      departmentSName: this.department.departmentSName,
      departmentFName: this.department.departmentFName,
      description: this.department.description,
      recordStatus: this.department.recordStatus,
      departmenteMail: this.department.departmenteMail
    };

    console.log('Add Department Payload:', payload);

    this.commonService.createDepartment(payload).subscribe({
      next: (res: any) => {
        console.log('Add Department:', res);

        const responseData = res?.body || res;

        if (responseData?.isSuccess) {
           this.toastr.success('Department Added Successfully');

          this.getDepartmentList();

          this.resetForm();
        } else {
       this.toastr.warning(responseData?.message || 'Something went wrong');
        }
      },
      error: (err: any) => {
        console.log('API Error:', err);
      },
    });
  }

  editData(data: any) {
    console.log('Edit Data:', data);
    this.department = {
      departmentId: data.departmentId,
      departmentFName: data.departmentFName,
      departmentSName: data.departmentSName,
      description: data.description,
      recordStatus: data.recordStatus,
      departmenteMail: data.departmenteMail,
    };

    // OPEN MODAL
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('departmentModal'),
    );

    modal.show();
  }

 updateDepartmentData(){
    const payload = {
      departmentId: this.department.departmentId,
      departmentFName: this.department.departmentFName,
      departmentSName: this.department.departmentSName,
      description: this.department.description,
      recordStatus: this.department.recordStatus,
      departmenteMail: this.department.departmenteMail,
    };

    console.log('Update Payload:', payload);

    this.commonService.updateDepartment(payload).subscribe({
      next: (res: any) => {
        console.log('Update Response:', res);

        const responseData = res?.body ;

        if (responseData?.isSuccess) {
          this.toastr.success('Department Updated Successfully');

          this.getDepartmentList();

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
      `Are you sure you want to delete ${data.departmentFName} ?`,
    );
    if (!isConfirm) {
      return;
    }
    this.commonService.deleteDepartment(data.departmentId).subscribe({
      next: (res: any) => {
        console.log('Delete Response:', res);
        const responseData = res?.body || res;
        if (responseData?.isSuccess) {
           this.toastr.success('Department Deleted Successfully');
          // refresh list
          this.getDepartmentList();
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
