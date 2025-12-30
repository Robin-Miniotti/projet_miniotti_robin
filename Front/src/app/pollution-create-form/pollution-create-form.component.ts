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
  providers: [PollutionServiceService],
  standalone: true
})
export class PollutionCreateFormComponent {
  submitted = false;
  pollutionForm: FormGroup;
  availableTypes: string[] = ['Air', 'Eau', 'Chimique', 'Autre', 'Plastique', 'Depots sauvages'];

  constructor(private fb: FormBuilder, private router: Router, private pollutionService: PollutionServiceService) {
    this.pollutionForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(5)]],
      type_pollution: ['', Validators.required],
      description: ['', Validators.required],
      lieu: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      date_observation: ['', Validators.required],
      photo_url: [''] // image is optional
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
