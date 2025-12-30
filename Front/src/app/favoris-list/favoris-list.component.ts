import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FavorisService } from '../favoris/favoris.service';
import { Pollution } from '../models/pollution';

@Component({
  selector: 'app-favoris-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="favoris-container">
      <div class="header">
        <h2>Mes Favoris</h2>
        <span class="count-badge">{{ (favorisCount$ | async) || 0 }}</span>
      </div>
      
      @if ((favorisCount$ | async) === 0) {
        <div class="empty-state">
          <p>Aucune pollution favorite pour le moment.</p>
          <p>Ajoutez des pollutions à vos favoris depuis la liste principale !</p>
        </div>
      } @else {
        <div class="favoris-actions">
          <button (click)="clearAll()" class="clear-all-btn">
            Effacer tous les favoris
          </button>
        </div>
        
        <ul class="favoris-list">
          @for (pollution of favoris$ | async; track pollution.id) {
            <li class="favori-item">
              <img
                [src]="pollution.photo_url"
                alt="Photo de la pollution"
                class="pollution-photo"
              />
              <div class="pollution-info">
                <h3>{{ pollution.titre }}</h3>
                <p class="type">{{ pollution.type_pollution }}</p>
                <p class="location">📍 {{ pollution.location }}</p>
              </div>
              <div class="actions">
                <button 
                  [routerLink]="['/pollutions/details', pollution.id]" 
                  class="view-btn">
                  Voir détails
                </button>
                <button 
                  (click)="removeFavori(pollution.id)" 
                  class="remove-btn"
                  title="Retirer des favoris">
                  ★
                </button>
              </div>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .favoris-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }

    .header h2 {
      margin: 0;
      color: #333;
    }

    .count-badge {
      background-color: #ff6b6b;
      color: white;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      color: #6c757d;
    }

    .empty-state p:first-child {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .favoris-actions {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .clear-all-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .clear-all-btn:hover {
      background-color: #c82333;
      transform: translateY(-1px);
    }

    .favoris-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .favori-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      margin-bottom: 15px;
      background-color: #fff;
      border-radius: 8px;
      border: 2px solid #ff6b6b;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .favori-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .pollution-photo {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .pollution-info {
      flex: 1;
      min-width: 0;
    }

    .pollution-info h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 18px;
    }

    .pollution-info .type {
      display: inline-block;
      background-color: #007bff;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 8px;
    }

    .pollution-info .location {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-shrink: 0;
    }

    .view-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .view-btn:hover {
      background-color: #0056b3;
    }

    .remove-btn {
      background-color: #ff6b6b;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.2s ease;
    }

    .remove-btn:hover {
      background-color: #ff5252;
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .favori-item {
        flex-direction: column;
        text-align: center;
      }

      .actions {
        flex-direction: row;
        width: 100%;
      }

      .actions button {
        flex: 1;
      }
    }
  `]
})
export class FavorisListComponent implements OnInit {
  favoris$!: Observable<Pollution[]>;
  favorisCount$!: Observable<number>;

  constructor(private favorisService: FavorisService) {}

  ngOnInit(): void {
    this.favoris$ = this.favorisService.getFavoris();
    this.favorisCount$ = this.favorisService.getFavorisCount();
  }

  removeFavori(pollutionId: number): void {
    this.favorisService.removeFavori(pollutionId);
  }

  clearAll(): void {
    if (confirm('Êtes-vous sûr de vouloir effacer tous vos favoris ?')) {
      this.favorisService.clearFavories();
    }
  }
}
