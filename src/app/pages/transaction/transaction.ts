import { Component } from '@angular/core';
import { Navbar } from '../../layout/navbar/navbar';
import { TransactionService } from '../../services/transactionService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddTransaction } from '../add-transaction/add-transaction';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './transaction.html',
  styleUrls: ['./transaction.css'], // <- correction ici
})
export class Transaction {

  search: string = ''; // <- ajout de la propriété search
  transactions: any[] = [];

  constructor(private transactionService: TransactionService,private dialog:MatDialog) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getByEntreprise(3).subscribe(data => {
      this.transactions = data;
      console.log(data);
    });
  }

  // Ajouter
  add() {
    const newTransaction = {
      description: "Test",
      montant: 100,
      typeOperation: "DEBIT",
      dateTransaction: "2026-03-28",
      statut: "REALISE",
      source: "MANUEL",
      categoriseAuto: false,
      tauxTva: 20,
      entreprise: { id: 1 }
    };

    this.transactionService.addTransaction(newTransaction)
      .subscribe(() => this.loadTransactions());
  }

  // Supprimer
  delete(id: number) {
    this.transactionService.deleteTransaction(id)
      .subscribe(() => this.loadTransactions());
  }
  openAddTransactionDialog() {
    const dialogRef = this.dialog.open(AddTransaction, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: 'manual' | 'integration' | 'pdf' | undefined) => {
      if(result) {
        console.log('Méthode choisie :', result);
        // ici tu peux rediriger vers la saisie manuelle, intégration ou import PDF
      }
    });
  }

}
