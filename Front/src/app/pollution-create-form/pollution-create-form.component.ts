import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pollution } from '../models/pollution';
import { Router } from '@angular/router';
import { PollutionServiceService } from '../pollution-service.service';

@Component({
  selector: 'app-pollution-create-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-create-form.component.html',
  styleUrls: ['./pollution-create-form.component.css'],
  standalone: true
})
export class PollutionCreateFormComponent {
  submitted = false;
  pollutionForm: FormGroup;
  availableTypes: string[] = ['Air', 'Eau', 'Chimique', 'Autre', 'Plastique', 'Depots sauvages'];
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private pollutionService: PollutionServiceService) {
    this.pollutionForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(5)]],
      type_pollution: ['', Validators.required],
      description: ['', Validators.required],
      lieu: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      date_observation: ['', Validators.required],
      discoveredBy: [''],
      photo_base_64: [''],
      photo_mime_type: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5 MB');
        return;
      }
      
      this.selectedFile = file;
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Convertir en base64 pour l'envoi
      const base64Reader = new FileReader();
      base64Reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64String = e.target?.result as string;
        // Extraire seulement la partie base64 (sans le préfixe data:image/...)
        const base64Data = base64String.split(',')[1];
        this.pollutionForm.patchValue({
          photo_base_64: base64Data,
          photo_mime_type: file.type
        });
      };
      base64Reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.pollutionForm.patchValue({
      photo_base_64: '',
      photo_mime_type: ''
    });
  }

  returnToList() {
    this.router.navigate(['/pollutions']);
  }
    

  onSubmit() {
    this.submitted = true;
    if (this.pollutionForm.valid) {
      this.pollutionService.createPollution(this.pollutionForm.value).subscribe(() => {
        this.returnToList();
      });
      this.pollutionForm.reset();
      this.submitted = false;
    }
  }

  onReturn() {    
  this.pollutionForm.reset();
  this.submitted = false;
  this.returnToList();
  }  
}
