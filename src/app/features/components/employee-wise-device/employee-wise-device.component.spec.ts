import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWiseDeviceComponent } from './employee-wise-device.component';

describe('EmployeeWiseDeviceComponent', () => {
  let component: EmployeeWiseDeviceComponent;
  let fixture: ComponentFixture<EmployeeWiseDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeWiseDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeWiseDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
