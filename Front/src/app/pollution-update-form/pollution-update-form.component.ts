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
      photo_url: [''] // image is optional
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
      console.log('Submitting update for ID:', this.pollutionId);
      console.log('Form value:', this.pollutionForm.value);
      this.pollutionService.updatePollution(this.pollutionId, this.pollutionForm.value).subscribe({
        next: () => {
          this.returnToList();
        },
        error: (err) => {
          console.error('Error updating pollution:', err);
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
