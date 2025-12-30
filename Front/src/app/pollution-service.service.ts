import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject, of } from 'rxjs';
import { Pollution } from './models/pollution';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class PollutionServiceService {
  private pollutionsSubject = new BehaviorSubject<Pollution[]>([]);
  private pollutions$ = this.pollutionsSubject.asObservable();
  private isDataLoaded = false;

  constructor(private http: HttpClient) { 
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<Pollution[]>(environment.apiUrl+"/pollution").subscribe(pollutions => {
      this.pollutionsSubject.next(pollutions);
      this.isDataLoaded = true;
    });
  }

  getPollutions(): Observable<Pollution[]> {
    if (environment.apiUrl.includes('.json')) {
      return this.pollutions$;
    }
    return this.http.get<Pollution[]>(environment.apiUrl+"/pollution");
  }

   public addPollution(pollution: Pollution) {
    return this.http.post<Pollution>(environment.apiUrl+"/pollution", pollution);
  }

  updatePollution(id: number, pollution: Partial<Pollution>): Observable<Pollution> {
    return this.http.put<Pollution>(`${environment.apiUrl}/pollution/${id}`, pollution);
  }
 
  getPollutionById(id: number): Observable<Pollution> {
    if (environment.apiUrl.includes('.json')) {
      return this.getPollutions().pipe(
        map(pollutions => {
          const pollution = pollutions.find(p => p.id === id);
          if (!pollution) {
            throw new Error(`Pollution with id ${id} not found`);
          }
          return pollution;
        })
      );
    }
    return this.http.get<Pollution>(`${environment.apiUrl}/pollution/${id}`);
  }

  deletePollution(id: number): Observable<void> {
    if (environment.apiUrl.includes('.json')) {      
      const currentPollutions = this.pollutionsSubject.value;
      const filteredPollutions = currentPollutions.filter(p => p.id !== id);
      this.pollutionsSubject.next(filteredPollutions);
      return of(void 0);
    }
    return this.http.delete<void>(`${environment.apiUrl}/pollution/${id}`);
  }

  getPollutionsBy(PollutionType: string, PollutionTitle:string): Observable<Pollution[]> {
    return this.getPollutions().pipe(
      map(pollutions => pollutions.filter(p =>
        p.titre.includes(PollutionTitle) &&
        (PollutionType === '' || p.type_pollution === PollutionType)
      ))
    );
  }

  createPollution(pollution: Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(environment.apiUrl + '/pollution', pollution);
  }
}

