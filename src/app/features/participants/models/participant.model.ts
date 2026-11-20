export interface Participant {
  _id: string;
  trip: string;
  name: string;
  email: string;
}

export interface CreateParticipantDto {
  name: string;
  email: string;
}

export interface UpdateParticipantDto {
  name: string;
  email: string;
}