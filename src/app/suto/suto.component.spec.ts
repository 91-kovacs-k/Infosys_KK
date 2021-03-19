import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SutoComponent } from './suto.component';

describe('SutoComponent', () => {
  let component: SutoComponent;
  let fixture: ComponentFixture<SutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SutoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
