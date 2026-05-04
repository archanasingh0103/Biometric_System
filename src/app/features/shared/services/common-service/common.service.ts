import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { API_CONSTANT } from '../../constants/API.Constant';
import { HttpService } from '../../http-service/http.service';

@Injectable({
  providedIn: 'root',
})
export class CommmonService {
  constructor(private apiService: HttpService) {}

  // device list
  deviceList(page: number, pageSize: number): Observable<any> {
    const url = API_CONSTANT.deviceList
      .replace('${page}', page.toString())
      .replace('${pageSize}', pageSize.toString());

    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  // employee list
  employeeList(page: number = 1, pageSize: number = 1000): Observable<any> {
    const url = API_CONSTANT.employeeList
      .replace('${page}', page.toString())
      .replace('${pageSize}', pageSize.toString());

    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // Employee Wise Device GET
  getEmployeeWiseDevice(
    empCode: string,
    search: string = '',
    page: number = 1,
    pageSize: number = 25,
    link?: boolean,
  ): Observable<any> {
    let url = API_CONSTANT.employeeWiseDevice
      .replace('${empCode}', empCode)
      .replace('${search}', search)
      .replace('${page}', page.toString())
      .replace('${pageSize}', pageSize.toString())
      .replace('${link}', link === undefined ? '' : String(link));

    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  // Get Device Wise Employee
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

  //Post API
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

  // Employee Dropdown
  employeeDropdown(): Observable<any> {
    const url = API_CONSTANT.employeeDropdown;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  // Device Dropdown
  deviceDropdown(): Observable<any> {
    const url = API_CONSTANT.deviceDropdown;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // assign employee with device
  assignEmployeeDevice(payload: any): Observable<any> {
    const url = API_CONSTANT.assignEmployeeDevice;
    return this.apiService
      .post(url, payload, {
        responseType: 'text',
      })
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  // Remove Device
  // removeEmployeeDevice(payload: {
  //   employeeCode: string;
  //   deviceId: number;
  //   serialNumber: string;
  // }): Observable<any> {
  //   const url = API_CONSTANT.removeEmployeeDevice;
  //   return this.apiService
  //     .post(payload, url)
  //     .pipe(catchError((error: HttpErrorResponse) => of(error)));
  // }

  removeEmployeeDevice(payload: any): Observable<any> {
    const url = API_CONSTANT.removeEmployeeDevice;
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
    
  }
}
