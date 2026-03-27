import { Component } from '@angular/core';
import { Navbar } from '../../layout/navbar/navbar';
import { CommonModule } from '@angular/common';
import { EvenementService, Event } from '../../services/event';

@Component({
  selector: 'app-evenement',
  imports: [Navbar,CommonModule],
  templateUrl: './evenement.html',
  styleUrl: './evenement.css',
})
export class Evenement {
  activeTab: string = 'clients';
   entreprise_id = 3; // id de l'entreprise du user connecté
  clients: EvenementService[] = [];
  fournisseurs: EvenementService[] = [];
  evenements: EvenementService[] = [];

  constructor(private eventService: Event) { }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.eventService.getByType(this.entreprise_id, 'CREANCE_CLIENT')
      .subscribe(data => this.clients = data);

    this.eventService.getByType(this.entreprise_id, 'DETTE_FOURNISSEUR')
      .subscribe(data => this.fournisseurs = data);

    this.eventService.getByType(this.entreprise_id, 'AUTRE')
      .subscribe(data => this.evenements = data);
  }

}
