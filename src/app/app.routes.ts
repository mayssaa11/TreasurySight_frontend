//Définition des routes de ton application (ex: login, dashboard)

import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Evenement } from './pages/evenement/evenement';
import { AddEvenement } from './pages/add-evenement/add-evenement';
import { Transaction } from './pages/transaction/transaction';
import { Prediction } from './pages/prediction/prediction';

export const routes: Routes = [
  {path:'',component:Accueil},
  {path:'login',component:Login},
  {path:'register',component:Register},
  {path:'dashboard',component:Dashboard},
  {path:'events',component:Evenement},
  {path:'addEvenement',component:AddEvenement},
  {path:'transaction',component:Transaction},
  {path:'prediction',component:Prediction}
];
