import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pollution } from '../models/pollution';
import { Router, ActivatedRoute } from '@angular/router';
import { PollutionServiceService } from '../pollution-service.service';

@Component({
  selector: 'app-pollution-update-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-update-form.component.html',
  styleUrl: './pollution-update-form.component.css',
  standalone: true
})
export class PollutionUpdateFormComponent {
  submitted = false;
  pollutionForm: FormGroup;
  availableTypes: string[] = ['Air', 'Eau', 'Chimique', 'Autre', 'Plastique','Depots sauvages'];
  pollutionId: number = -1;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private pollutionService: PollutionServiceService) {
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

  ngOnInit(): void {
    this.pollutionId = Number(this.route.snapshot.params['id']);
    this.pollutionService.getPollutionById(this.pollutionId).subscribe(pollution => {
      this.pollutionForm.patchValue(pollution);
    });
  }

  returnToList() {
    this.router.navigate(['/pollutions']);
  }
    

  onSubmit() {
    this.submitted = true;
    if (this.pollutionForm.valid) {
      this.pollutionService.updatePollution(this.pollutionId, this.pollutionForm.value).subscribe({
        next: () => {
          this.returnToList();
        },
        error: (err) => {
          alert('Erreur lors de la mise à jour: ' + (err.error?.message || err.message));
        }
      });      
      this.submitted = false;
    }
  }

  onReturn() {      
  this.submitted = false;
  this.returnToList();
  }  
}
