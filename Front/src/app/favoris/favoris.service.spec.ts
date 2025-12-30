import { TestBed } from '@angular/core/testing';
import { FavorisService } from './favoris.service';
import { NgxsModule, Store } from '@ngxs/store';
import { FavorisState } from './favoris.state';
import { Pollution } from '../models/pollution';

describe('FavorisService', () => {
  let service: FavorisService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([FavorisState])]
    });
    service = TestBed.inject(FavorisService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a pollution to favorites', () => {
    const pollution: Pollution = {
      id: 1,
      titre: 'Test Pollution',
      type_pollution: 'Air',
      description: 'Test description',
      date_observation: new Date(),
      location: 'Test location',
      latitude: 48.8566,
      longitude: 2.3522,
      photo_url: 'test.jpg'
    };

    service.addFavori(pollution);
    const favoris = service.getFavorisSnapshot();
    
    expect(favoris.length).toBe(1);
    expect(favoris[0].id).toBe(1);
  });

  it('should remove a pollution from favorites', () => {
    const pollution: Pollution = {
      id: 1,
      titre: 'Test Pollution',
      type_pollution: 'Air',
      description: 'Test description',
      date_observation: new Date(),
      location: 'Test location',
      latitude: 48.8566,
      longitude: 2.3522,
      photo_url: 'test.jpg'
    };

    service.addFavori(pollution);
    service.removeFavori(1);
    const favoris = service.getFavorisSnapshot();
    
    expect(favoris.length).toBe(0);
  });

  it('should clear all favorites', () => {
    const pollution1: Pollution = {
      id: 1,
      titre: 'Test Pollution 1',
      type_pollution: 'Air',
      description: 'Test description',
      date_observation: new Date(),
      location: 'Test location',
      latitude: 48.8566,
      longitude: 2.3522,
      photo_url: 'test.jpg'
    };

    const pollution2: Pollution = {
      id: 2,
      titre: 'Test Pollution 2',
      type_pollution: 'Water',
      description: 'Test description',
      date_observation: new Date(),
      location: 'Test location',
      latitude: 48.8566,
      longitude: 2.3522,
      photo_url: 'test.jpg'
    };

    service.addFavori(pollution1);
    service.addFavori(pollution2);
    service.clearFavories();
    const favoris = service.getFavorisSnapshot();
    
    expect(favoris.length).toBe(0);
  });

  it('should check if a pollution is a favorite', () => {
    const pollution: Pollution = {
      id: 1,
      titre: 'Test Pollution',
      type_pollution: 'Air',
      description: 'Test description',
      date_observation: new Date(),
      location: 'Test location',
      latitude: 48.8566,
      longitude: 2.3522,
      photo_url: 'test.jpg'
    };

    service.addFavori(pollution);
    
    expect(service.isFavori(1)).toBe(true);
    expect(service.isFavori(2)).toBe(false);
  });

  it('should toggle a pollution in favorites', () => {
    const pollution: Pollution = {
      id: 1,
      titre: 'Test Pollution',
      type_pollution: 'Air',
      description: 'Test description',
      date_observation: new Date(),
      location: 'Test location',
      latitude: 48.8566,
      longitude: 2.3522,
      photo_url: 'test.jpg'
    };

    service.toggleFavori(pollution);
    expect(service.isFavori(1)).toBe(true);

    service.toggleFavori(pollution);
    expect(service.isFavori(1)).toBe(false);
  });
});
