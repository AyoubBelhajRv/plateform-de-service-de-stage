import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-telechargement-rapport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './telechargement-rapport.component.html',
  styleUrl: './telechargement-rapport.component.css'
})
export class TelechargementRapportComponent {
  selectedFile: File | undefined;
  uploadSuccess: boolean = false;
  pdfSrc: String | null = null;
  errorMessage: String | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile && this.selectedFile.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.pdfSrc = e.target?.result as String;
        this.errorMessage = null;
        this.pdfSrc = null; 
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.errorMessage = 'Please select a PDF file.';
    }
  }

  uploadFile(event: any) {
    event.preventDefault();
    // Here you can implement file upload logic (e.g., using services)
    // For demonstration, let's just set uploadSuccess to true after 2 seconds
    setTimeout(() => {
      this.uploadSuccess = true;
    }, 2000);
  }

}
