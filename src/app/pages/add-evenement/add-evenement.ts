import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Event } from '../../services/event';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-evenement',
  imports: [ReactiveFormsModule,MatButtonModule,MatInputModule,MatFormFieldModule,MatSelectModule,MatCheckboxModule,MatDatepickerModule,
  MatNativeDateModule],
  templateUrl: './add-evenement.html',
  styleUrl: './add-evenement.css',
})
export class AddEvenement {

  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddEvenement>,
    private eventService:Event
  ) {
    this.eventForm = this.fb.group({
      date_echeance: [''],
      description: [''],
      est_recurrent: [false],
      jour_recurrence: [null],
      montant: [0],
      categorie: [''],
      sous_categorie: [''],
      type: [''],
      statut: ['PREVU'],
      taux_tva: [0],
      type_operation: [''],
      id_entreprise: [3] // mettre valeur par défaut si besoin
    });
  }

onSubmit() {
  if (this.eventForm.invalid) return;


  console.log("DATA ENVOYÉE :", this.eventForm.value);

  this.eventService.save(this.eventForm.value)
    .subscribe({
      next: (res) => {
        console.log("Succès :", res);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error("Erreur :", err);
      }
    });
}

}
