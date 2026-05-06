export const API_CONSTANT = {
  //Device api
  deviceList:
    // 'Devices/GetDeviceList?pageNumber=${page}&pageSize=${pageSize}',
    'Devices/GetDeviceList?pageNumber=${page}&pageSize=${pageSize}',
  deviceWiseEmployee:
    // 'Devices/DeviceWithEmployee?deviceId=${deviceId}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',
   'Devices/DeviceWithEmployee?deviceId=${deviceId}&search=${search}&link=${link}&pageNumber=${pageNumber}&pageSize=${pageSize}',

  //Employee api
  employeeList:
    'Employee/GetEmployeeList?pageNumber=${page}&pageSize=${pageSize}',

  // post api for link dlink
  accessEmployeeDevice: 'Devices/Access-employee-devices',
  accessDeviceWiseEmployee: 'Devices/Access-devices-employee',

  employeeDropdown: 'Devices/employee-dropdown',

  deviceDropdown: 'Devices/devices-dropdown',

  employeeWiseDevice:
    // 'Devices/EmployeeWithDevices?employeecode=${empCode}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',
    'Devices/EmployeeWithDevices?employeecode=${empCode}&search=${search}&link=${link}&pageNumber=${page}&pageSize=${pageSize}',

  assignEmployeeDevice:
    'Devices/AssignEmployeeWithDevice',
  
  removeEmployeeDevice:'Devices/RemoveEmployeeFromDevice'

};
