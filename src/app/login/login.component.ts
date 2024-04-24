import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/auth.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(): void {
    console.log('Submitted:', this.username, this.password);
  }


  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Handle successful login, e.g., store token, navigate to another page
        console.log('Login successful', response);
      },
      (error) => {
        // Handle login error, e.g., show error message
        console.error('Login error', error);
        this.errorMessage = error; // Display error message in the template
      }
    );
  }
}
