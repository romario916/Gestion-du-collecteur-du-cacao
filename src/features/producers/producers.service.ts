
import type {
  Producer,
  CreateProducerInput,
  UpdateProducerInput,
} from "./producers.types";

const STORAGE_KEY = "cacao-sambirano-producers";

function getStoredProducers(): Producer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? (JSON.parse(stored) as Producer[]) : [];
  } catch {
    return [];
  }
}

function saveProducers(producers: Producer[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(producers));
}

function normalizeText(value: string): string {
  return value.trim();
}

function validateProducerInput(data: CreateProducerInput): void {
  if (!normalizeText(data.nom)) {
    throw new Error("Le nom du producteur est obligatoire.");
  }

  if (!normalizeText(data.prenom)) {
    throw new Error("Le prénom du producteur est obligatoire.");
  }

  if (!normalizeText(data.telephone)) {
    throw new Error("Le numéro de téléphone est obligatoire.");
  }

  if (!normalizeText(data.commune)) {
    throw new Error("La commune est obligatoire.");
  }

  if (!normalizeText(data.region)) {
    throw new Error("La région est obligatoire.");
  }

  if (!Number.isFinite(data.superficie) || data.superficie < 0) {
    throw new Error("La superficie doit être un nombre positif ou nul.");
  }

  if (
    !Number.isInteger(data.nombreParcelles) ||
    data.nombreParcelles < 0
  ) {
    throw new Error("Le nombre de parcelles doit être un entier positif ou nul.");
  }
}

function generateProducerNumber(producers: Producer[]): string {
  const nextNumber = producers.length + 1;

  return `PROD-${String(nextNumber).padStart(4, "0")}`;
}

export function getProducers(): Producer[] {
  return getStoredProducers();
}

export function createProducer(
  data: CreateProducerInput,
): Producer {
  validateProducerInput(data);

  const producers = getStoredProducers();

  const producer: Producer = {
    id: crypto.randomUUID(),
    numero: generateProducerNumber(producers),
    nom: normalizeText(data.nom),
    prenom: normalizeText(data.prenom),
    telephone: normalizeText(data.telephone),
    email: normalizeText(data.email),
    adresse: normalizeText(data.adresse),
    fokontany: normalizeText(data.fokontany),
    commune: normalizeText(data.commune),
    district: normalizeText(data.district),
    region: normalizeText(data.region),
    superficie: data.superficie,
    nombreParcelles: data.nombreParcelles,
    actif: true,
    dateInscription: new Date().toISOString(),
  };

  producers.push(producer);
  saveProducers(producers);

  return producer;
}

export function updateProducer(
  id: string,
  data: UpdateProducerInput,
): Producer {
  validateProducerInput(data);

  const producers = getStoredProducers();
  const index = producers.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Producteur introuvable.");
  }

  const updatedProducer: Producer = {
    ...producers[index],
    nom: normalizeText(data.nom),
    prenom: normalizeText(data.prenom),
    telephone: normalizeText(data.telephone),
    email: normalizeText(data.email),
    adresse: normalizeText(data.adresse),
    fokontany: normalizeText(data.fokontany),
    commune: normalizeText(data.commune),
    district: normalizeText(data.district),
    region: normalizeText(data.region),
    superficie: data.superficie,
    nombreParcelles: data.nombreParcelles,
    actif: data.actif,
  };

  producers[index] = updatedProducer;
  saveProducers(producers);

  return updatedProducer;
}

export function deleteProducer(id: string): void {
  const producers = getStoredProducers();
  const filteredProducers = producers.filter((item) => item.id !== id);

  if (filteredProducers.length === producers.length) {
    throw new Error("Producteur introuvable.");
  }

  saveProducers(filteredProducers);
}
