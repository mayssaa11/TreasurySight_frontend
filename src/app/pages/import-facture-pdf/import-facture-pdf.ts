import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-import-facture-pdf',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './import-facture-pdf.html',
  styleUrl: './import-facture-pdf.css',
})
export class ImportFacturePdf {

  pdfForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ImportFacturePdf>
  ) {
    this.pdfForm = this.fb.group({
      file: [null]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.pdfForm.patchValue({ file });
      console.log('Fichier PDF sélectionné:', file.name);
    } else {
      alert('Veuillez sélectionner un fichier PDF valide.');
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.selectedFile) {
      console.log('PDF à traiter:', this.selectedFile);
      // Ici, appeler ton service pour scanner / extraire les données du PDF
      this.dialogRef.close(this.selectedFile);
    }
  }

}
