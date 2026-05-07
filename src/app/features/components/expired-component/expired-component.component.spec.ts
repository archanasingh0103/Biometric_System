import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredComponentComponent } from './expired-component.component';

describe('ExpiredComponentComponent', () => {
  let component: ExpiredComponentComponent;
  let fixture: ComponentFixture<ExpiredComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
