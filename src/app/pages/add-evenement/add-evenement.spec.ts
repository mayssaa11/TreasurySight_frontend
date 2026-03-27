import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEvenement } from './add-evenement';

describe('AddEvenement', () => {
  let component: AddEvenement;
  let fixture: ComponentFixture<AddEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEvenement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEvenement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
