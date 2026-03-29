import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AddTransactionManual } from '../add-transaction-manual/add-transaction-manual';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImportFacturePdf } from '../import-facture-pdf/import-facture-pdf';

@Component({
  selector: 'app-add-transaction',
  standalone: true,              // <-- important si tu veux utiliser `imports`
  imports: [FormsModule,ReactiveFormsModule, MatRadioModule, MatButtonModule,MatDialogModule],        // <-- permet l'utilisation de [(ngModel)]
  templateUrl: './add-transaction.html',
  styleUrls: ['./add-transaction.css'] // petit typo corrigé 'styleUrl' → 'styleUrls'
})
export class AddTransaction {

  method: 'manual' | 'integration' | 'pdf' | null = null;
constructor(private dialog: MatDialog) {}
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  onCancel() {
    this.cancel.emit();
  }

onSubmit() {
    if (this.method) {
      switch (this.method) {
        case 'manual':
          this.openTransactionPopup();
          break;

        case 'pdf':
          this.openPdfImportPopup();
          break;

        default:
          this.submit.emit(this.method);
          console.log('Méthode sélectionnée:', this.method);
      }
    }
  }

  // Popup pour saisie manuelle
  openTransactionPopup() {
    const dialogRef = this.dialog.open(AddTransactionManual, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Transaction reçue du popup:', result);
        this.submit.emit('manual'); // ou envoyer les données réelles
      }
    });
  }

  // Popup pour import PDF
  openPdfImportPopup() {
    const dialogRef = this.dialog.open(ImportFacturePdf, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((file: File) => {
      if (file) {
        console.log('Fichier PDF importé:', file);
        // Ici tu appelles ton service backend/OCR pour extraire les champs
        const transactionFromPdf = {
          date_transaction: '2026-03-29',
          description: 'Facture PDF importée',
          montant: 1200,
          sous_categorie: 'FACTURE_CLIENT',
          type_operation: 'CREDIT',
          taux_tva: 20,
          id_compte: 1,
          id_entreprise: 1,
          categorise_auto: 1,
          source: 'PDF'
        };

        this.submit.emit('pdf');
        console.log('Transaction extraite du PDF:', transactionFromPdf);
      }
    });
  }

}
