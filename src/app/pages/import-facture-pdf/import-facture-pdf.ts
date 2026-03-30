import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImportService } from '../../services/import';

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
      private dialogRef: MatDialogRef<ImportFacturePdf>,
      private importService: ImportService
    ) {
      this.pdfForm = this.fb.group({
        file: [null]
      });
    }

    onFileSelected(event: any) {
      const file: File = event.target.files[0];

      if (!file || file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF valide.');
        return;
      }

      this.selectedFile = file;
      this.pdfForm.patchValue({ file });
    }

    onCancel() {
      this.dialogRef.close();
    }

    onSubmit() {
      const entrepriseId = 1;

      if (!this.selectedFile) return;

      console.log('Uploading PDF...');

      this.importService.parsePdf(this.selectedFile, entrepriseId).subscribe({
        next: (response) => {
          console.log('Extraction result:', response);

          // 👉 Close dialog and send extracted data
          this.dialogRef.close(response);
        },
        error: (err) => {
          console.error('Error during parsing:', err);
          alert('Erreur lors du traitement du fichier.');
        }
      });
    }

  }
