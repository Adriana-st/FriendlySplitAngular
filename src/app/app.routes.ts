import { Routes } from '@angular/router';
import { TripList } from './features/trips/pages/trip-list/trip-list';
import { TripDetails } from './features/trips/pages/trip-details/trip-details';
import { TripForm } from './features/trips/pages/trip-form/trip-form';
import { ParticipantForm } from './features/participants/pages/participant-form/participant-form';
import { ExpenseForm } from './features/expenses/pages/expense-form/expense-form';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },
  { path: 'trips', component: TripList },
  { path: 'trips/new', component: TripForm },
  { path: 'trips/:id', component: TripDetails },
  { path: 'trips/:id/edit', component: TripForm },
  { path: 'trips/:tripId/participants/new', component: ParticipantForm },
  { path: 'trips/:tripId/participants/:participantId/edit', component: ParticipantForm },
  { path: 'trips/:tripId/expenses/new', component: ExpenseForm },

];