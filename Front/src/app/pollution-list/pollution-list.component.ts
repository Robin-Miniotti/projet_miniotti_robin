import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
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
export class PollutionListComponent implements OnInit, OnDestroy {

  pollutions$: Observable<Pollution[]>;  
  titreSearch: string = '';
  typePollutionSearch: string = '';
  availableTypes: string[] = ['Air', 'Eau', 'Chimique', 'Autre'];
  isCreating: boolean = false;
  showOnlyFavorites: boolean = false;
  isLoggedIn$: Observable<boolean>;
  private isLoggedIn: boolean = false;
  
  // Subjects for dynamic search
  private titreSearchSubject = new Subject<string>();
  private typeSearchSubject = new Subject<string>();
  private favoritesFilterSubject = new Subject<boolean>();

  constructor(
    private pollutionService: PollutionServiceService, 
    private router: Router,
    public favorisService: FavorisService,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.userService.isLoggedIn();
    
    // Subscribe to login status
    this.userService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
    
    // Setup dynamic search with debounce
    const titreSearch$ = this.titreSearchSubject.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    );
    
    const typeSearch$ = this.typeSearchSubject.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    );
    
    const favoritesFilter$ = this.favoritesFilterSubject.pipe(
      startWith(false)
    );
    
    // Combine all search criteria
    this.pollutions$ = combineLatest([titreSearch$, typeSearch$, favoritesFilter$]).pipe(
      switchMap(([titre, type, showFavorites]) => {
        // Get base pollutions
        let basePollutions$: Observable<Pollution[]>;
        
        if (titre.trim() === '' && type === '') {
          basePollutions$ = this.pollutionService.getPollutions();
        } else {
          basePollutions$ = this.pollutionService.getPollutionsBy(type, titre);
        }
        
        // Apply favorites filter if enabled
        if (showFavorites) {
          const favoris$ = this.favorisService.getFavoris();
          return combineLatest([basePollutions$, favoris$]).pipe(
            map(([allPollutions, favoritesList]) => {
              const favoriteIds = new Set(favoritesList.map(p => p.id));
              return allPollutions.filter(pollution => favoriteIds.has(pollution.id));
            })
          );
        } else {
          return basePollutions$;
        }
      })
    );
  }
  
  ngOnDestroy(): void {
    // Clean up subjects
    this.titreSearchSubject.complete();
    this.typeSearchSubject.complete();
    this.favoritesFilterSubject.complete();
  }
  
  // Called when user types in search fields
  onTitreSearchChange(): void {
    this.titreSearchSubject.next(this.titreSearch);
  }
  
  onTypeSearchChange(): void {
    this.typeSearchSubject.next(this.typePollutionSearch);
  }

  deletePollution(id: number): void {
    if (!this.isLoggedIn) {
      alert('⚠️ Vous devez être connecté pour supprimer une pollution.\n\nVeuillez vous connecter pour continuer.');
      this.router.navigate(['/login']);
      return;
    }
    
    this.pollutionService.deletePollution(id).subscribe(() => {
      // Trigger a refresh by re-emitting current search values
      this.titreSearchSubject.next(this.titreSearch);
    });
  }

  showDetails(pollutionId: number): void {
    this.router.navigate(['/pollutions/details', pollutionId]);
  }

  // hideDetails removed, navigation now handles details view

  TitleSearch(): void {
    // Deprecated - now using dynamic search
    this.onTitreSearchChange();
  }

  filterPollutions(): void {
    // Trigger search with current values
    this.titreSearchSubject.next(this.titreSearch);
    this.typeSearchSubject.next(this.typePollutionSearch);
  }

  clearFilters(): void {
    this.titreSearch = '';
    this.typePollutionSearch = '';
    this.showOnlyFavorites = false;
    this.titreSearchSubject.next('');
    this.typeSearchSubject.next('');
    this.favoritesFilterSubject.next(false);
  }

  // Toggle the favorites filter
  toggleFavoritesFilter(): void {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this.favoritesFilterSubject.next(this.showOnlyFavorites);
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
    // Trigger refresh with current search values
    this.titreSearchSubject.next(this.titreSearch);
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

