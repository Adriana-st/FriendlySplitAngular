import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Trip } from '../../models/trip.model';
import { TripService } from '../../services/trip.service';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-trip-details',
  imports: [DatePipe, RouterLink, MatButtonModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.scss',
})
export class TripDetails {
  private tripService = inject(TripService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  // Filled from the :id in the URL (withComponentInputBinding)
  readonly id = input.required<string>();

  readonly initial: LoadState<Trip> = { status: 'loading' };

  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.tripService.getTripById(id))),
    ),
    { initialValue: this.initial },
  );

  deleteTrip(trip: Trip): void {
    // The API also deletes the trip's participants and expenses
    if (!confirm(`Delete ${trip.name}? Its people and expenses will be deleted too.`)) return;

    this.deleting.set(true);
    this.deleteError.set(null);

    this.tripService.deleteTrip(trip._id).subscribe({
      next: () => {
        this.snackBar.open(`${trip.name} deleted`, 'Close', { duration: 5000 });
        this.router.navigate(['/trips']);
      },
      error: (err: Error) => {
        this.deleteError.set(err.message);
        this.deleting.set(false);
      },
    });
  }
}