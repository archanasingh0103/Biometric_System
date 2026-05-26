import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, pipe } from 'rxjs';
import { API_CONSTANT } from '../../constants/API.Constant';
import { HttpService } from '../../http-service/http.service';

@Injectable({
  providedIn: 'root',
})
export class CommmonService {
  constructor(private apiService: HttpService) {}

//  Device list
  deviceList(page: number, pageSize: number): Observable<any> {
    const url = API_CONSTANT.deviceList
      .replace('${page}', page.toString())
      .replace('${pageSize}', pageSize.toString());
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

//  Employee list
  employeeList(page: number = 1, pageSize: number = 1000): Observable<any> {
    const url = API_CONSTANT.employeeList
      .replace('${page}', page.toString())
      .replace('${pageSize}', pageSize.toString());
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // Employee Wise Device
  getEmployeeWiseDevice(
    empCode: string,
    search: string = '',
    page: number = 1,
    pageSize: number = 25,
    link?: boolean,
  ): Observable<any> {
    const url = API_CONSTANT.employeeWiseDevice
      .replace('${empCode}', empCode)
      .replace('${search}', search)
      .replace('${page}', page.toString())
      .replace('${pageSize}', pageSize.toString())
      .replace('${link}', link === undefined ? '' : String(link));
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

// Device Wise Employee 
  getDeviceWiseEmloyee(
    deviceId: string,
    page: number,
    pageSize: number,
    search: string = '',
    link?: boolean,
  ): Observable<any> {
    const url = API_CONSTANT.deviceWiseEmployee
      .replace('${deviceId}', deviceId)
      .replace('${search}', search)
      .replace('${link}', link !== undefined ? String(link) : '')
      .replace('${pageNumber}', page.toString())
      .replace('${pageSize}', pageSize.toString());
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // Post API
  updateEmployeeDeviceAccess(payload: any): Observable<any> {
    const url = API_CONSTANT.accessEmployeeDevice;
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateDeviceWiseEmoployeeAccess(payload: any): Observable<any> {
    const url = API_CONSTANT.accessDeviceWiseEmployee;
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  employeeDropdown(): Observable<any> {
    const url = API_CONSTANT.employeeDropdown;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deviceDropdown(): Observable<any> {
    const url = API_CONSTANT.deviceDropdown;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // Link
  assignEmployeeDevice(payload: any): Observable<any> {
    return this.apiService
      .post(API_CONSTANT.assignEmployeeDevice, payload, {
        responseType: 'text',
      })
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  removeEmployeeDevice(payload: any): Observable<any> {
    const url = API_CONSTANT.removeEmployeeDevice;
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  expiringSoonList(
    fromDate: string,
    toDate: string,
    pageNumber: number,
    pageSize: number,
  ): Observable<any> {
    const url = API_CONSTANT.expiringSoonList
      .replace('{fromDate}', fromDate.toString())
      .replace('{toDate}', toDate.toString())
      .replace('{pageNumber}', pageNumber.toString())
      .replace('{pageSize}', pageSize.toString());
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getDashboardSummary(days: number, id: number): Observable<any> {
    const url = API_CONSTANT.allActivity
      .replace('{days}', days.toString())
      .replace('{id}', id.toString());

    return this.apiService.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Dashboard API Error:', error);
        return of(null);
      }),
    );
  }

  donutSummary(): Observable<any> {
    const url = API_CONSTANT.donutList;
    return this.apiService.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Donut API Error:', error);
        return of(null);
      }),
    );
  }

  deviceEmployeeChart() {
    const url = API_CONSTANT.deviceEmloyeeChart;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // bulkActivity
  uploadExcel(payload: any) {
    const url = API_CONSTANT.bulkActivity;
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // COMPANY LIST
  getCompanyList(): Observable<any> {
    const url = API_CONSTANT.companyList;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // DEPARTMENT LIST
  getDepartmentList(): Observable<any> {
    const url = API_CONSTANT.departmentList;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // LOCATION LIST
  getLocationList(): Observable<any> {
    const url = API_CONSTANT.locationList;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // DESIGNATION LIST
  getDesignationList(): Observable<any> {
    const url = API_CONSTANT.designationList;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ADD EMPLOYEE
  addEmployee(payload: any): Observable<any> {
    const url = API_CONSTANT.addEmployee;
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
