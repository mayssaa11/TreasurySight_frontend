import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFacturePdf } from './import-facture-pdf';

describe('ImportFacturePdf', () => {
  let component: ImportFacturePdf;
  let fixture: ComponentFixture<ImportFacturePdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportFacturePdf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportFacturePdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
