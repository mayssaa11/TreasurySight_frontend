import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private authService:Auth,private router:Router){};

  registerForm=new FormGroup({
    nom:new FormControl('',),
    prenom:new FormControl(''),
    email:new FormControl('',[Validators.email,Validators.required]),
    nom_entreprise:new FormControl(''),
    secteur_entreprise:new FormControl(''),
    password:new FormControl('',[Validators.minLength(8),Validators.required,Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')]),
  })

  register() {
  if (this.registerForm.valid) {
    console.log('Formulaire valide');
    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        // 1 Stocker le token JWT
        localStorage.setItem('token', response.token);
        // 2 Rediriger vers le dashboard
        this.router.navigate(['/dashboard']);

      },
      error: (err) => {
        console.error('Erreur login', err);
      }
    });

  } else {
    console.log("Formulaire invalide");
    // On peut marquer tous les champs comme "touched" pour afficher les erreurs
    this.registerForm.markAllAsTouched();
  }
}



}
