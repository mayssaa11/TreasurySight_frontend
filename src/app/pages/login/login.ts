import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { HttpBackend, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private authService:Auth,private router:Router){};
  loginForm=new FormGroup({
    email:new FormControl(''),
    password:new FormControl('')
  })

  login(){
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        // 1 Stocker le token JWT
        localStorage.setItem('token', response.token);

        // 2 Rediriger vers le dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur login', err);
        alert('Email ou mot de passe incorrect');
      }
    })
  }

}
