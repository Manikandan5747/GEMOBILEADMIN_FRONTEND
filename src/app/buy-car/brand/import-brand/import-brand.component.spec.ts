import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBrandComponent } from './import-brand.component';

describe('ImportBrandComponent', () => {
  let component: ImportBrandComponent;
  let fixture: ComponentFixture<ImportBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBrandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
