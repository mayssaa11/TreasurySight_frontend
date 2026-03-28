import { Component } from '@angular/core';
import { Navbar } from '../../layout/navbar/navbar';
import { TransactionService } from '../../services/transactionService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './transaction.html',
  styleUrls: ['./transaction.css'], // <- correction ici
})
export class Transaction {

  search: string = ''; // <- ajout de la propriété search
  transactions: any[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getByEntreprise(1).subscribe(data => {
      this.transactions = data;
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

}
