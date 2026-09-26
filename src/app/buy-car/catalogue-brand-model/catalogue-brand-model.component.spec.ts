import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueBrandModelComponent } from './catalogue-brand-model.component';

describe('CatalogueBrandModelComponent', () => {
  let component: CatalogueBrandModelComponent;
  let fixture: ComponentFixture<CatalogueBrandModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueBrandModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueBrandModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
