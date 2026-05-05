export const API_CONSTANT = {
  //Device api
<<<<<<< HEAD
  deviceList:
    // 'Devices/GetDeviceList?pageNumber=${page}&pageSize=${pageSize}',
    'Devices/GetDeviceList?pageNumber=${page}&pageSize=${pageSize}',
  deviceWiseEmployee:
    // 'Devices/DeviceWithEmployee?deviceId=${deviceId}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',
   'Devices/DeviceWithEmployee?deviceId=${deviceId}&search=${search}&link=${link}&pageNumber=${pageNumber}&pageSize=${pageSize}',
=======
  deviceList: 'Devices/GetDeviceList?pageNumber=${page}&pageSize=${pageSize}',
  deviceWiseEmployee:
    // 'Devices/DeviceWithEmployee?deviceId=${deviceId}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',
   'Devices/DeviceWithEmployee?deviceId=${deviceId}&search=${search}&link=${link}&pageNumber=${pageNumber}&pageSize=${pageSize}',
  // 'Devices/DeviceWithEmployee?devicename=${deviceFName}&pageNumber=${page}&pageSize=${pageSize}',
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2

  //Employee api
  employeeList:
    'Employee/GetEmployeeList?pageNumber=${page}&pageSize=${pageSize}',

  // post api for link dlink
  accessEmployeeDevice: 'Devices/Access-employee-devices',
  accessDeviceWiseEmployee: 'Devices/Access-devices-employee',

  employeeDropdown: 'Devices/employee-dropdown',

  deviceDropdown: 'Devices/devices-dropdown',

  employeeWiseDevice:
<<<<<<< HEAD
    'Devices/EmployeeWithDevices?employeecode=${empCode}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',

  assignEmployeeDevice:
    'Devices/AssignEmployeeWithDevice',
  
  removeEmployeeDevice:'Devices/RemoveEmployeeFromDevice'

=======
    // 'Devices/EmployeeWithDevices?employeecode=${empCode}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',
    'Devices/EmployeeWithDevices?employeecode=${empCode}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',

  assignEmployeeDevice:
    // 'Devices/AssignEmployeeWithDevice'
    'Devices/AssignEmployeeWithDevice',
  
  removeEmployeeDevice:'Devices/RemoveEmployeeFromDevice'
>>>>>>> 21422b1d2a29037d8733e3a7cb63208807ceedb2
};
