import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Trip, CreateTripDto, UpdateTripDto } from '../models/trip.model';
import { TripBalances } from '../../balances/models/balances.model';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/trips';

  // The API returns { data: [...], meta: {...} }, so we keep only data
  getTrips(): Observable<Trip[]> {
    return this.http
      .get<{ data: Trip[] }>(this.apiUrl, { params: { limit: 100 } })
      .pipe(map((response) => response.data));
  }

  getTripById(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  addTrip(trip: CreateTripDto): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  updateTrip(id: string, changes: UpdateTripDto): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, changes);
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Returns one object with the trip's total spent, balances, and settlements
  getBalances(tripId: string): Observable<TripBalances> {
    return this.http.get<TripBalances>(`${this.apiUrl}/${tripId}/balances`);
  }
}