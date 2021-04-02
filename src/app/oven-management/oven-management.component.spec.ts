import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvenManagementComponent } from './oven-management.component';

describe('SutoManagementComponent', () => {
  let component: OvenManagementComponent;
  let fixture: ComponentFixture<OvenManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OvenManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OvenManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
