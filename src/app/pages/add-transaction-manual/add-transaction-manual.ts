import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-transaction-manual',
  imports: [ReactiveFormsModule,CommonModule, MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './add-transaction-manual.html',
  styleUrl: './add-transaction-manual.css',
})
export class AddTransactionManual {

  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTransactionManual>
  ) {
    this.transactionForm = this.fb.group({
      date_transaction: ['', Validators.required],
      description: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      sous_categorie: ['', Validators.required],
      statut: ['REALISE', Validators.required],
      taux_tva: [0, Validators.required],
      type_operation: ['CREDIT', Validators.required],
      id_compte: ['2', Validators.required],
      id_entreprise: ['3', Validators.required]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transaction = {
        ...this.transactionForm.value,
        categorise_auto: 0,
        source: 'MANUEL'
      };
      console.log('Transaction à envoyer:', transaction);
      // Ici tu peux appeler ton service pour sauvegarder la transaction
      this.dialogRef.close(transaction);
    }
  }

}
