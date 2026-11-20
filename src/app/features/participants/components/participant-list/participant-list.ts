import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Participant } from '../../models/participant.model';
import { ParticipantService } from '../../services/participant.service';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-participant-list',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './participant-list.html',
  styleUrl: './participant-list.scss',
})
export class ParticipantList implements OnInit {
  private participantService = inject(ParticipantService);

  readonly tripId = input.required<string>();

  readonly state = signal<LoadState<Participant[]>>({ status: 'loading' });
  readonly deleteError = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    withLoadState(this.participantService.getParticipants(this.tripId())).subscribe((result) =>
      this.state.set(result),
    );
  }

  deleteParticipant(person: Participant): void {
    if (!confirm(`Remove ${person.name} from this trip?`)) return;

    this.deleteError.set(null);
    this.participantService.deleteParticipant(this.tripId(), person._id).subscribe({
      next: () => this.load(),
      error: (err: Error) => this.deleteError.set(err.message),
    });
  }
}