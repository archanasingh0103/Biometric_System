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
  days: number,
  pageNumber: number,
  pageSize: number
): Observable<any> {

  const url = API_CONSTANT.expiringSoonList
    .replace('{days}', days.toString())
    .replace('{pageNumber}', pageNumber.toString())
    .replace('{pageSize}', pageSize.toString());

  return this.apiService.get(url).pipe(
    catchError((error: HttpErrorResponse) => of(error))
  );
}

  // ─── Dashboard summary (combines device + employee calls) ─
  // getDashboardSummary(): Observable<{
  //   totalDevices: number;
  //   totalEmployees: number;
  //   linkedDevices: number;
  //   unlinkedDevices: number;
  //   expiringSoon: number;
  // }> {
  //   return forkJoin({
  //     devices: this.deviceList(1, 10000),
  //     employees: this.employeeList(1, 10000),
  //   }).pipe(
  //     map(({ devices, employees }) => {
  //       // normalise arrays from various response shapes
  //       const devList: any[] = this._toArray(devices);
  //       const empList: any[] = this._toArray(employees);

  //       const linked = devList.filter(
  //         (d: any) => d.Link === '1' || d.link === true || d.isLinked === true,
  //       ).length;
  //       const unlinked = devList.length - linked;

  //       // devices expiring within 30 days
  //       const now = new Date();
  //       const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  //       const expiring = devList.filter((d: any) => {
  //         if (!d.ValidToDate && !d.validToDate) return false;
  //         const exp = new Date(d.ValidToDate || d.validToDate);
  //         return exp > now && exp <= in30;
  //       }).length;

  //       return {
  //         totalDevices: devList.length,
  //         totalEmployees: empList.length,
  //         linkedDevices: linked,
  //         unlinkedDevices: unlinked,
  //         expiringSoon: expiring,
  //       };
  //     }),
  //     catchError(() =>
  //       of({
  //         totalDevices: 0,
  //         totalEmployees: 0,
  //         linkedDevices: 0,
  //         unlinkedDevices: 0,
  //         expiringSoon: 0,
  //       }),
  //     ),
  //   );
  // }
 getDashboardSummary(days: number, id: number): Observable<any> {
  const url = API_CONSTANT.allActivity
    .replace('{days}', days.toString())
    .replace('{id}', id.toString());

  return this.apiService.get(url).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Dashboard API Error:', error);
      return of(null); // 👈 safe fallback
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

  // ─── Helper ───────────────────────────────────────────────
  // private _toArray(res: any): any[] {
  //   if (Array.isArray(res)) return res;
  //   if (Array.isArray(res?.body)) return res.body;
  //   if (Array.isArray(res?.data)) return res.data;
  //   if (Array.isArray(res?.items)) return res.items;
  //   return [];
  // }
}
