import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject, of } from 'rxjs';
import { Pollution } from './models/pollution';
import { PollutionResponse } from './models/api-responses';
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
    return this.http.get<PollutionResponse[]>(environment.apiUrl+"/pollution").pipe(
      map(data => data.map(item => Object.assign(new Pollution(), item)))
    );
  }

   public addPollution(pollution: Pollution) {
    return this.http.post<PollutionResponse>(environment.apiUrl+"/pollution", pollution).pipe(
      map(data => Object.assign(new Pollution(), data))
    );
  }

  updatePollution(id: number, pollution: Partial<Pollution>): Observable<Pollution> {
    return this.http.put<PollutionResponse>(`${environment.apiUrl}/pollution/${id}`, pollution).pipe(
      map(data => Object.assign(new Pollution(), data))
    );
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
    return this.http.get<PollutionResponse>(`${environment.apiUrl}/pollution/${id}`).pipe(
      map(data => Object.assign(new Pollution(), data))
    );
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

