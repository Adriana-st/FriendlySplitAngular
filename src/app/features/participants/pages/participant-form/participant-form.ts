import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateParticipantDto } from '../../models/participant.model';
import { ParticipantService } from '../../services/participant.service';
import { notBlank } from '../../../../shared/not-blank.validator';

@Component({
  selector: 'app-participant-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './participant-form.html',
  styleUrl: './participant-form.scss',
})
export class ParticipantForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private participantService = inject(ParticipantService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // The names must match the route parameters :tripId and :participantId
  readonly tripId = input.required<string>();
  readonly participantId = input<string>(); // empty when adding

  saving = signal(false);
  saveError = signal<string | null>(null);

  participantForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(60), notBlank]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    const id = this.participantId();
    if (!id) return; // adding a new person, nothing to load

    this.participantService.getParticipantById(this.tripId(), id).subscribe({
      next: (person) => this.participantForm.patchValue({ name: person.name, email: person.email }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

  onSubmit(): void {
    if (this.participantForm.invalid) {
      this.participantForm.markAllAsTouched();
      return;
    }

    const person: CreateParticipantDto = this.participantForm.getRawValue();
    const id = this.participantId();
    const request = id
      ? this.participantService.updateParticipant(this.tripId(), id, person)
      : this.participantService.addParticipant(this.tripId(), person);

    this.saving.set(true);
    this.saveError.set(null);
    this.participantForm.disable();

    request.subscribe({
      next: (saved) => {
        this.snackBar.open(`${saved.name} saved`, 'Close', { duration: 5000 });
        this.router.navigate(['/trips', this.tripId()]);
      },
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
        this.participantForm.enable();
      },
    });
  }
}