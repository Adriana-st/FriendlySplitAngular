import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Participant, CreateParticipantDto, UpdateParticipantDto } from '../models/participant.model';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private http = inject(HttpClient);
  // Participants are nested under a trip: /trips/:tripId/participants
  private apiUrl = 'http://localhost:3000/api/v1/trips';

  getParticipants(tripId: string): Observable<Participant[]> {
    return this.http
      .get<{ data: Participant[] }>(`${this.apiUrl}/${tripId}/participants`, { params: { limit: 100 } })
      .pipe(map((response) => response.data));
  }

  getParticipantById(tripId: string, id: string): Observable<Participant> {
    return this.http.get<Participant>(`${this.apiUrl}/${tripId}/participants/${id}`);
  }

  addParticipant(tripId: string, participant: CreateParticipantDto): Observable<Participant> {
    return this.http.post<Participant>(`${this.apiUrl}/${tripId}/participants`, participant);
  }

  updateParticipant(tripId: string, id: string, changes: UpdateParticipantDto): Observable<Participant> {
    return this.http.put<Participant>(`${this.apiUrl}/${tripId}/participants/${id}`, changes);
  }

  deleteParticipant(tripId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tripId}/participants/${id}`);
  }
}