import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SutoManagementComponent } from './suto-management.component';

describe('SutoManagementComponent', () => {
  let component: SutoManagementComponent;
  let fixture: ComponentFixture<SutoManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SutoManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SutoManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
