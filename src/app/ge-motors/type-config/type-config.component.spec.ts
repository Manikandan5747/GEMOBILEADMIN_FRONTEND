import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeConfigComponent } from './type-config.component';

describe('TypeConfigComponent', () => {
  let component: TypeConfigComponent;
  let fixture: ComponentFixture<TypeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
