import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkActivityComponent } from './bulk-activity.component';

describe('BulkActivityComponent', () => {
  let component: BulkActivityComponent;
  let fixture: ComponentFixture<BulkActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
