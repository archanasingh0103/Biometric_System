import { Component, OnInit } from '@angular/core';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-designation',
  imports: [
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css',
})
export class DesignationComponent implements OnInit {
  designationList: any[] = [];
  searchText = '';
  filteredList: any[] = [];
  isLoading: boolean = false;
  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };
  tableHeading = [
    { key: 'Sno', title: 'S. No.' },
    { key: 'designationId', title: 'Designation Id' },
    { key: 'designationsName', title: 'Designation Id' },
    { key: 'designationCode', title: 'Designation Code' },
    {
      key: 'normalNoticePeriodRequired',
      title: 'Normal Notice Period Required',
    },
    { key: 'action', title: 'Action' },
  ];

  designation = {
    designationId: 0,
    designationsName: '',
    designationCode: '',
    normalNoticePeriodRequired: 0,
  };
  constructor(
    private commonService: CommmonService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.getdesignationList();
  }

  get startVlaue() {
    return (this.pagesize.offset - 1) * this.pagesize.limit + 1;
  }

  get lastValue() {
    const last = this.startVlaue + this.designationList.length - 1;
    return Math.min(last, this.pagesize.count);
  }

  getdesignationList() {
    this.isLoading = true;
    this.commonService
      .newDesignationList(
        this.pagesize.limit,
        this.pagesize.offset,
        this.searchText,
      )
      .subscribe({
        next: (res: any) => {
          console.log('Designation List:', res);
          this.designationList = res?.body?.data || [];
          this.filteredList = [...this.designationList];
          this.pagesize.count = this.designationList.length;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  onTablePageChange(page: number) {
    this.pagesize.offset = page;
    this.getdesignationList();
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
    this.getdesignationList();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.getdesignationList();
  }
  resetForm() {
    this.designation = {
      designationId: 0,
      designationsName: '',
      designationCode: '',
      normalNoticePeriodRequired: 0,
    };
  }

  closeModal() {
    const modalElement = document.getElementById('designationModal');
    const modalInstance = (window as any).bootstrap.Modal.getInstance(
      modalElement,
    );
    modalInstance?.hide();
  }

  addForm() {
    const payload = {
      designationsName: this.designation.designationsName,
      designationCode: this.designation.designationCode,
      normalNoticePeriodRequired: this.designation.normalNoticePeriodRequired,
    };
    this.isLoading = true;
    console.log('Designation Payload:', payload);
    this.commonService.createDesignation(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const responseData = res?.body || [];
        if (responseData?.isSuccess) {
          this.toastr.success('Designation Added Successfully');
          this.getdesignationList();
          this.resetForm();
          this.closeModal();
        } else {
          this.toastr.warning(responseData?.message || 'Something went wrong');
        }
      },
      error(err) {
        console.log('Designation Error:', err);
      },
    });
  }

  editData(data: any) {
    console.log('Edit Data:', data);
    this.designation = {
      designationId: data.designationId,
      designationsName: data.designationsName,
      designationCode: data.designationCode,
      normalNoticePeriodRequired: data.normalNoticePeriodRequired,
    };

    // OPEN MODAL
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('designationModal'),
    );
    modal.show();
  }

 updateDesignationData() {
  const payload = {
    designationId: this.designation.designationId,
    designationsName: this.designation.designationsName,
    designationCode: this.designation.designationCode,
    normalNoticePeriodRequired: this.designation.normalNoticePeriodRequired,
  };
  console.log('Update Designation :', payload);
  this.commonService.updateDesignation(payload).subscribe({
    next: (res: any) => {
      console.log('Update Response:', res);
      const responseData = res?.body;

      if (responseData?.isSuccess) {
        this.toastr.success('Designation Updated Successfully');

        this.getdesignationList(); 
        this.resetForm();          
        this.closeModal();        
      } else {
        this.toastr.warning(responseData?.message || 'Something went wrong');
      }
    },

    error: (err: any) => {
      console.log('Update Designation Error:', err);
    },
  });
}

  deleteData(data: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        title: 'Delete Designation',
        message: `Are you sure you want to delete ${data.designationsName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commonService.deleteDesignation(data.designationId).subscribe({
          next: (res: any) => {
            console.log('Delete Response:', res);
            const responseData = res?.body || res;
            if (responseData?.isSuccess) {
              this.toastr.success('Designation Deleted Successfully');
              this.getdesignationList();
            } else {
              this.toastr.warning(
                responseData?.message || 'Something went wrong',
              );
            }
          },
          error: (err: any) => {
            console.log('Delete Error:', err);
            this.toastr.error('API Error');
          },
        });
      }
    });
  }
}
