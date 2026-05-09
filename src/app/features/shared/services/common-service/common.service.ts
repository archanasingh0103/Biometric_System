import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { API_CONSTANT } from '../../constants/API.Constant';
import { HttpService } from '../../http-service/http.service';

@Injectable({
  providedIn: 'root',
})
export class CommmonService {
  constructor(private apiService: HttpService) {}

  // ─── Device list ──────────────────────────────────────────
  deviceList(page: number, pageSize: number): Observable<any> {
    const url = API_CONSTANT.deviceList
      .replace('${page}', page.toString())
      .replace('${pageSize}', pageSize.toString());
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ─── Employee list ────────────────────────────────────────
  employeeList(page: number = 1, pageSize: number = 1000): Observable<any> {
    const url = API_CONSTANT.employeeList
      .replace('${page}', page.toString())
      .replace('${pageSize}', pageSize.toString());
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ─── Employee Wise Device ─────────────────────────────────
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

  // ─── Device Wise Employee ─────────────────────────────────
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

  // ─── Post APIs ────────────────────────────────────────────
  updateEmployeeDeviceAccess(payload: any): Observable<any> {
    return this.apiService
      .post(API_CONSTANT.accessEmployeeDevice, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateDeviceWiseEmoployeeAccess(payload: any): Observable<any> {
    return this.apiService
      .post(API_CONSTANT.accessDeviceWiseEmployee, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  employeeDropdown(): Observable<any> {
    return this.apiService
      .get(API_CONSTANT.employeeDropdown)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deviceDropdown(): Observable<any> {
    return this.apiService
      .get(API_CONSTANT.deviceDropdown)
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
    return this.apiService
      .post(API_CONSTANT.removeEmployeeDevice, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

expiringSoonList(
  fromDate: string,
  toDate:string,
  pageNumber: number,
  pageSize: number
): Observable<any> {

  const url = API_CONSTANT.expiringSoonList
    .replace('{fromDate}', fromDate.toString())
    .replace('{toDate}',toDate.toString())
    .replace('{pageNumber}', pageNumber.toString())
    .replace('{pageSize}', pageSize.toString());

  return this.apiService.get(url).pipe(
    catchError((error: HttpErrorResponse) => of(error))
  );
}

 getDashboardSummary(days: number, id: number): Observable<any> {
  const url = API_CONSTANT.allActivity
    .replace('{days}', days.toString())
    .replace('{id}', id.toString());

  return this.apiService.get(url).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Dashboard API Error:', error);
      return of(null); 
    })
  );
}

donutSummary(): Observable<any> {
  const url = API_CONSTANT.donutList;

  return this.apiService.get(url).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Donut API Error:', error);
      return of(null);
    })
  );
}

}
