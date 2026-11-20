import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-card',
  imports: [DatePipe, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.scss',
})
export class TripCard {
  trip = input.required<Trip>();
}