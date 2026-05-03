import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceWiseEmployeeComponent } from './device-wise-employee.component';

describe('DeviceWiseEmployeeComponent', () => {
  let component: DeviceWiseEmployeeComponent;
  let fixture: ComponentFixture<DeviceWiseEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceWiseEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceWiseEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
