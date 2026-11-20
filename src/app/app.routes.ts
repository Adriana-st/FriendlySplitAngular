import { Routes } from '@angular/router';
import { TripList } from './features/trips/pages/trip-list/trip-list';
import { TripDetails } from './features/trips/pages/trip-details/trip-details';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },
  { path: 'trips', component: TripList },
  { path: 'trips/:id', component: TripDetails },
];