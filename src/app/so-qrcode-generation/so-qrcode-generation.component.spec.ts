import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoQrcodeGenerationComponent } from './so-qrcode-generation.component';

describe('SoQrcodeGenerationComponent', () => {
  let component: SoQrcodeGenerationComponent;
  let fixture: ComponentFixture<SoQrcodeGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoQrcodeGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoQrcodeGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
