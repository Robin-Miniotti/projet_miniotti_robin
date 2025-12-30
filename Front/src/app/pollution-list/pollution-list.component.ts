import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PollutionServiceService } from '../pollution-service.service';
import { Pollution } from '../models/pollution';
import { PollutionCreateFormComponent } from '../pollution-create-form/pollution-create-form.component';
import { FavorisService } from '../favoris/favoris.service';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-pollution-list', 
  imports: [CommonModule, RouterModule, FormsModule, PollutionCreateFormComponent],
  templateUrl: './pollution-list.component.html',
  styleUrl: './pollution-list.component.css', 
  providers: [PollutionServiceService],
  standalone: true
})  
export class PollutionListComponent implements OnInit {

  pollutions$: Observable<Pollution[]>;  
  titreSearch: string = '';
  typePollutionSearch: string = '';
  availableTypes: string[] = ['Air', 'Eau', 'Chimique', 'Autre'];
  isCreating: boolean = false;
  showOnlyFavorites: boolean = false;
  isLoggedIn$: Observable<boolean>;
  private isLoggedIn: boolean = false;

  constructor(
    private pollutionService: PollutionServiceService, 
    private router: Router,
    public favorisService: FavorisService,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.pollutions$ = this.pollutionService.getPollutions();
    this.isLoggedIn$ = this.userService.isLoggedIn();
    
    // Subscribe to login status
    this.userService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  deletePollution(id: number): void {
    if (!this.isLoggedIn) {
      alert('⚠️ Vous devez être connecté pour supprimer une pollution.\n\nVeuillez vous connecter pour continuer.');
      this.router.navigate(['/login']);
      return;
    }
    
    this.pollutionService.deletePollution(id).subscribe(() => {
      this.pollutions$ = this.pollutionService.getPollutions();
    });
  }

  showDetails(pollutionId: number): void {
    this.router.navigate(['/pollutions/details', pollutionId]);
  }

  // hideDetails removed, navigation now handles details view

  TitleSearch(): void {
    if (this.titreSearch.trim() === '') {      
      this.pollutions$ = this.pollutionService.getPollutions();
    } else {      
      this.pollutions$ = this.pollutionService.getPollutionsBy('', this.titreSearch);
      console.log(this.pollutions$);
    }
  }

  filterPollutions(): void {
    // Get base pollutions first
    let basePollutions$: Observable<Pollution[]>;
    
    if (this.titreSearch.trim() === '' && this.typePollutionSearch === '') {
      basePollutions$ = this.pollutionService.getPollutions();
    } else {
      basePollutions$ = this.pollutionService.getPollutionsBy(this.typePollutionSearch, this.titreSearch);
    }
    
    // Apply favorites filter if enabled
    if (this.showOnlyFavorites) {
      const favoris$ = this.favorisService.getFavoris();
      this.pollutions$ = combineLatest([basePollutions$, favoris$]).pipe(
        map(([allPollutions, favoritesList]) => {
          const favoriteIds = new Set(favoritesList.map(p => p.id));
          return allPollutions.filter(pollution => favoriteIds.has(pollution.id));
        })
      );
    } else {
      this.pollutions$ = basePollutions$;
    }
  }

  clearFilters(): void {
    this.titreSearch = '';
    this.typePollutionSearch = '';
    this.showOnlyFavorites = false;
    this.pollutions$ = this.pollutionService.getPollutions();
  }

  // Toggle the favorites filter
  toggleFavoritesFilter(): void {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this.filterPollutions();
  }  

  editPollution(pollutionId: number): void {
    if (!this.isLoggedIn) {
      alert('⚠️ Vous devez être connecté pour modifier une pollution.\n\nVeuillez vous connecter pour continuer.');
      this.router.navigate(['/login']);
      return;
    }
    
    this.router.navigate(['/pollutions/edit', pollutionId]);
  }
  
  startCreating(): void {
    if (!this.isLoggedIn) {
      alert('⚠️ Vous devez être connecté pour créer une pollution.\n\nVeuillez vous connecter pour continuer.');
      this.router.navigate(['/login']);
      return;
    }
    
    this.isCreating = true;    
    this.router.navigate(['/pollutions/create']);
  }

  onPollutionCreated($event: Event) {
    this.isCreating = false;
    this.pollutions$ = this.pollutionService.getPollutions();
  }

  // Check if a pollution is in favorites
  isFavorite(pollutionId: number): boolean {
    return this.favorisService.isFavori(pollutionId);
  }

  // Toggle favorite status (add or remove)
  toggleFavorite(pollution: Pollution): void {
    this.favorisService.toggleFavori(pollution);
  }
}

