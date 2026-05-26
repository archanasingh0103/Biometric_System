export const API_CONSTANT = {
  // Device api
  deviceList: 'Devices/GetDeviceList?pageNumber=${page}&pageSize=${pageSize}',
  deviceWiseEmployee:'Devices/DeviceWithEmployee?deviceId=${deviceId}&search=${search}&link=${link}&pageNumber=${pageNumber}&pageSize=${pageSize}',

  // Employee api
  employeeList:'Employee/GetEmployeeList?pageNumber=${page}&pageSize=${pageSize}',
  
  // Post api for link dlink
  accessEmployeeDevice: 'Devices/Access-employee-devices',
  accessDeviceWiseEmployee: 'Devices/Access-devices-employee',
  employeeDropdown: 'Devices/employee-dropdown',
  deviceDropdown: 'Devices/devices-dropdown',
  employeeWiseDevice:'Devices/EmployeeWithDevices?employeecode=${empCode}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',
  assignEmployeeDevice: 'Devices/AssignEmployeeWithDevice',
  removeEmployeeDevice: 'Devices/RemoveEmployeeFromDevice',
  allActivity: 'Dashboard/GetAllActivity?days={days}&id={id}',
  expiringSoonList:'Dashboard/expiring-soon-list?fromDate={fromDate}&toDate={toDate}&pageNumber={pageNumber}&pageSize={pageSize}',
  donutList: 'Dashboard/device-distribution',
  deviceEmloyeeChart: 'Dashboard/GetDeviceEmployeeChart',

  // bulk-activity
  bulkActivity: 'EmployeeDeviceAccessReport/UploadExcelFile',

  // EMPLOYEE MANAGEMENT
  addEmployee: 'WebAPI/AddEmployee?APIKey=280411042215',
  companyList: 'Company/GetCompanyServiceList',
  departmentList: 'Department',
  locationList: 'WebAPI/GetLocationList?APIKey=280411042215',
  designationList: 'WebAPI/GetDesignationList?APIKey=280411042215',
};
