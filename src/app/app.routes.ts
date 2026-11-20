import { Routes } from '@angular/router';
import { TripList } from './features/trips/pages/trip-list/trip-list';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },
  { path: 'trips', component: TripList },
];