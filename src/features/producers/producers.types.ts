
export interface Producer {
  id: string;
  numero: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  fokontany: string;
  commune: string;
  district: string;
  region: string;
  superficie: number;
  nombreParcelles: number;
  actif: boolean;
  dateInscription: string;
}

export interface CreateProducerInput {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  fokontany: string;
  commune: string;
  district: string;
  region: string;
  superficie: number;
  nombreParcelles: number;
}

export interface UpdateProducerInput extends CreateProducerInput {
  actif: boolean;
}
