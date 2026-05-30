import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommmonService } from '../../shared/services/common-service/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-location',
  imports: [FormsModule, CommonModule, NgxPaginationModule,MatDialogModule,
    MatButtonModule,],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css',
})
export class LocationComponent {
  locationList: any[] = [];
  filteredList: any[] = [];
  isLoading: boolean = false;
  searchText = '';

  tableHeading = [
    { key: 'Sno', title: 'S.No.' },
    { key: 'locationName', title: 'Location Name' },
    { key: 'locationCode', title: 'Location Code' },
    {
      key: 'leaveApprovalWorkFlowId',
      title: 'Leave Approval WorkFlowId',
    },
    {
      key: 'odApprovalWorkFlowId',
      title: 'OD Approval WorkFlowId',
    },
    { key: 'action', title: 'Action' },
  ];

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  location = {
    locationId: 0,
    locationName: '',
    locationCode: '',
    leaveApprovalWorkFlowId: 0,
    odApprovalWorkFlowId: 0,
    attRegularizeApprovalWorkFlowId: 0,
    locationLattitude: '',
    locationLongitude: '',
    radius: 0,
    isActive: 0,
    clutureTimeZoneName: '',
    clutureName: '',
    locationFullAddress: '',
  };

  constructor(private commonService: CommmonService, private toastr: ToastrService,private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getLocationList();
  }

  getLocationList() {
    this.isLoading = true;

    this.commonService
      .locationList(this.pagesize.offset, this.pagesize.limit, this.searchText)
      .subscribe({
        next: (res: any) => {
          console.log('Location List:', res);
          const responseData = res?.body || res;
          this.locationList = responseData?.data || [];
          this.filteredList = [...this.locationList];
          this.pagesize.count = responseData?.totalRecords || 0;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log('Location List Error:', err);
          this.isLoading = false;
        },
      });
  }

 
  get startValue(): number {
    return (this.pagesize.offset - 1) * this.pagesize.limit + 1;
  }

  get lastValue(): number {
    const last = this.startValue + this.locationList.length - 1;

    return Math.min(last, this.pagesize.count);
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
    this.pagesize.offset = 1;
    this.getLocationList();
  }

  onPageSizeChange(event: any) {
    this.pagesize.limit = +event.target.value;
    this.pagesize.offset = 1;
    this.getLocationList();
  }

  onTablePageChange(page: number) {
    this.pagesize.offset = page;
    this.getLocationList();
  }

  resetForm() {
    this.location = {
      locationId: 0,
      locationName: '',
      locationCode: '',
      leaveApprovalWorkFlowId: 0,
      odApprovalWorkFlowId: 0,
      attRegularizeApprovalWorkFlowId: 0,
      locationLattitude: '',
      locationLongitude: '',
      radius: 0,
      isActive: 0,
      clutureTimeZoneName: '',
      clutureName: '',
      locationFullAddress: '',
    };
  }
 closeModal() {
    const modalElement = document.getElementById('locationModal');
    const modalInstance = (window as any).bootstrap.Modal.getInstance(
      modalElement,
    );
    modalInstance?.hide();
  }

  openAddForm() {
    const payload = {
      locationName: this.location.locationName,
      locationCode: this.location.locationCode,
      leaveApprovalWorkFlowId: this.location.leaveApprovalWorkFlowId,
      odApprovalWorkFlowId: this.location.odApprovalWorkFlowId,
      attRegularizeApprovalWorkFlowId:
        this.location.attRegularizeApprovalWorkFlowId,
      locationLattitude: this.location.locationLattitude,
      locationLongitude: this.location.locationLongitude,
      radius: this.location.radius,
      isActive: this.location.isActive,
      clutureTimeZoneName: this.location.clutureTimeZoneName,
      clutureName: this.location.clutureName,
    };

    console.log('Create Payload:', payload);
    this.commonService.createLocation(payload).subscribe({
      next: (res: any) => {
        console.log('Create Response:', res);
        const responseData = res?.body || res;
        if (responseData?.isSuccess) {;
          this.toastr.success('Location Added Successfully');
          this.getLocationList();
          this.resetForm();
          this.closeModal();
        } else {
          this.toastr.warning(responseData?.message || 'Something went wrong');
        }
      },
      error: (err: any) => {
        console.log('Create Error:', err);
      },
    });
  }


  editData(data: any) {
    console.log('Edit Data:', data);
    this.location = {
      locationId: data.locationId || 0,
      locationName: data.locationName || '',
      locationCode: data.locationCode || '',
      leaveApprovalWorkFlowId: data.leaveApprovalWorkFlowId || 0,
      odApprovalWorkFlowId: data.odApprovalWorkFlowId || 0,
      attRegularizeApprovalWorkFlowId:
        data.attRegularizeApprovalWorkFlowId || 0,
      locationLattitude: data.locationLattitude || '',
      locationLongitude: data.locationLongitude || '',
      radius: data.radius || 0,
      isActive: data.isActive || 0,
      clutureTimeZoneName: data.clutureTimeZoneName || '',
      clutureName: data.clutureName || '',
      locationFullAddress: data.locationFullAddress || '',
    };

    // OPEN MODAL
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('locationModal'),
    );
    modal.show();
  }


  updateLocationData() {
    const payload = {
      locationId: this.location.locationId,
      locationName: this.location.locationName,
      locationCode: this.location.locationCode,
      leaveApprovalWorkFlowId: this.location.leaveApprovalWorkFlowId,
      odApprovalWorkFlowId: this.location.odApprovalWorkFlowId,
      locationFullAddress: this.location.locationFullAddress,
      isActive: this.location.isActive,
      clutureTimeZoneName: this.location.clutureTimeZoneName,
      clutureName: this.location.clutureName,
    };
    console.log('Update Payload:', payload);
    this.commonService.updateLocation(payload).subscribe({
      next: (res: any) => {
        console.log('Update Response:', res);
        const responseData = res?.body || res;
        if (responseData?.isSuccess) {
          this.toastr.success('Location Updated Successfully');
          this.getLocationList();
          this.resetForm();
          // CLOSE MODAL
          const modalElement = document.getElementById('locationModal');
          const modal = (window as any).bootstrap.Modal.getInstance(
            modalElement,
          );

          modal?.hide();
        } else {
         this.toastr.warning(responseData?.message || 'Something went wrong');
        }
      },

      error: (err: any) => {
        console.log('Update Error:', err);
      },
    });
  }

   deleteData(data: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Location',
        message: `Are you sure you want to delete ${data.locationName}?`
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commonService.deleteLoaction(data.locationId).subscribe({
          next: (res: any) => {
            console.log('Delete Response:', res);
            const responseData = res?.body || res;
            if (responseData?.isSuccess) {
              this.toastr.success('Location Deleted Successfully');
              this.getLocationList();
            } else {
              this.toastr.warning(
                responseData?.message || 'Something went wrong'
              );
            }
          },
          error: (err: any) => {
            console.log('Delete Error:', err);
            this.toastr.error('API Error');
          }
        });
      }
    });
  }
}
