# Favorites State Management System

This folder contains the complete state management implementation for the favorites feature using NGXS.

## Structure

- **favoris.state.ts**: The NGXS state that manages the favorites list
- **favoris.service.ts**: Service providing convenient methods to interact with the state
- **addfavori.action.ts**: Action to add a pollution to favorites
- **removefavori.action.ts**: Action to remove a pollution from favorites
- **clearfavories.action.ts**: Action to clear all favorites
- **favoris-state-model.ts**: TypeScript interface for the state model
- **favoris.ts**: Interface for the favorites data structure

## Features

- **Add pollution to favorites**: Prevents duplicates
- **Remove pollution from favorites**: By pollution ID
- **Clear all favorites**: Remove all items at once
- **Check if pollution is favorite**: Query method
- **Count favorites**: Get the total number of favorites
- **Persistent storage**: Favorites are stored in localStorage via NGXS Storage Plugin

## Usage

### In a Component

```typescript
import { Component, OnInit } from '@angular/core';
import { FavorisService } from './favoris/favoris.service';
import { Pollution } from './models/pollution';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-example',
  template: `
    <div *ngFor="let pollution of favoris$ | async">
      <h3>{{ pollution.titre }}</h3>
      <button (click)="removeFavori(pollution.id)">Remove</button>
    </div>
    <button (click)="clearAll()">Clear All</button>
  `
})
export class ExampleComponent implements OnInit {
  favoris$!: Observable<Pollution[]>;
  favorisCount$!: Observable<number>;

  constructor(private favorisService: FavorisService) {}

  ngOnInit() {
    // Get all favorites as an observable
    this.favoris$ = this.favorisService.getFavoris();
    
    // Get count as an observable
    this.favorisCount$ = this.favorisService.getFavorisCount();
  }

  addFavori(pollution: Pollution) {
    this.favorisService.addFavori(pollution);
  }

  removeFavori(pollutionId: number) {
    this.favorisService.removeFavori(pollutionId);
  }

  toggleFavori(pollution: Pollution) {
    this.favorisService.toggleFavori(pollution);
  }

  isFavori(pollutionId: number): boolean {
    return this.favorisService.isFavori(pollutionId);
  }

  clearAll() {
    this.favorisService.clearFavories();
  }
}
```

### Using Store Directly

If you prefer to use the Store directly instead of the service:

```typescript
import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddFavori, RemoveFavori, ClearFavories } from './favoris';
import { FavorisState } from './favoris/favoris.state';
import { Pollution } from './models/pollution';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  @Select(FavorisState.getFavoris) favoris$!: Observable<Pollution[]>;
  @Select(FavorisState.getFavorisCount) count$!: Observable<number>;

  constructor(private store: Store) {}

  addFavori(pollution: Pollution) {
    this.store.dispatch(new AddFavori(pollution));
  }

  removeFavori(pollutionId: number) {
    this.store.dispatch(new RemoveFavori(pollutionId));
  }

  clearFavories() {
    this.store.dispatch(new ClearFavories());
  }

  isFavori(pollutionId: number): boolean {
    const isFavoriSelector = this.store.selectSnapshot(FavorisState.isFavori);
    return isFavoriSelector(pollutionId);
  }
}
```

## Selectors

The state provides the following selectors:

- `FavorisState.getFavoris`: Returns the array of favorite pollutions
- `FavorisState.isFavori`: Returns a function to check if a pollution ID is in favorites
- `FavorisState.getFavorisCount`: Returns the number of favorites

## Persistence

Favorites are automatically persisted to localStorage thanks to the NGXS Storage Plugin configured in `app.module.ts`. The state is saved with the key `favoris` and will be automatically restored when the app loads.

## Testing

The service includes comprehensive unit tests in `favoris.service.spec.ts` covering all the main functionality.
