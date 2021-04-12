import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPizzaComponent } from './modify-pizza.component';

describe('ModifyPizzaComponent', () => {
  let component: ModifyPizzaComponent;
  let fixture: ComponentFixture<ModifyPizzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyPizzaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPizzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
