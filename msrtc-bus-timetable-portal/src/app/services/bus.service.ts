import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Depot } from '../models/depot.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  constructor(private http: HttpClient) {}

  private cleanCityName(city: string): string {
    return city.replace(/\s*\(.*?\)\s*/g, '').trim();
  }

  getCityData(city: string): Observable<Depot[]> {
    const cleanedCity = this.cleanCityName(city);
    return this.http.get<Depot[]>(`assets/data/${cleanedCity.toLowerCase()}.json`);
  }
}
