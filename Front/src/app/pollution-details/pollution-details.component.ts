import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Pollution } from '../models/pollution';
import { PollutionServiceService } from '../pollution-service.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-pollution-details',
  imports: [CommonModule],
  templateUrl: './pollution-details.component.html',
  styleUrls: ['./pollution-details.component.css'],
  providers: [PollutionServiceService],
  standalone: true
})
export class PollutionDetailsComponent implements OnInit {
  pollutionId!: number;
  pollution$: Observable<Pollution>;

  constructor(
    private pollutionService: PollutionServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pollutionId = +id;
        this.pollution$ = this.pollutionService.getPollutionById(this.pollutionId);
      }
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

