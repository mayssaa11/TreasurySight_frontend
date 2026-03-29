import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionManual } from './add-transaction-manual';

describe('AddTransactionManual', () => {
  let component: AddTransactionManual;
  let fixture: ComponentFixture<AddTransactionManual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransactionManual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransactionManual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
