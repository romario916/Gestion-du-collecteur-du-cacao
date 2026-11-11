
import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customers.types";

const STORAGE_KEY = "cacao-sambirano-customers";

function getStoredCustomers(): Customer[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) return [];

    const parsedData: unknown = JSON.parse(storedData);

    return Array.isArray(parsedData) ? (parsedData as Customer[]) : [];
  } catch {
    return [];
  }
}

function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

function generateCustomerNumber(customers: Customer[]): string {
  const numbers = customers
    .map((customer) => Number(customer.numero.replace("CLI-", "")))
    .filter((number) => Number.isInteger(number) && number > 0);

  const nextNumber = Math.max(0, ...numbers) + 1;

  return `CLI-${String(nextNumber).padStart(4, "0")}`;
}

export function getCustomers(): Customer[] {
  return getStoredCustomers();
}

export function getCustomerById(id: string): Customer | undefined {
  return getStoredCustomers().find((customer) => customer.id === id);
}

export function createCustomer(input: CreateCustomerInput): Customer {
  const customers = getStoredCustomers();

  if (!input.telephone.trim()) {
    throw new Error("Le numéro de téléphone est obligatoire.");
  }

  if (input.type === "PARTICULIER" && !input.nom.trim()) {
    throw new Error("Le nom du client est obligatoire.");
  }

  if (input.type === "ENTREPRISE" && !input.nomEntreprise.trim()) {
    throw new Error("Le nom de l'entreprise est obligatoire.");
  }

  const customer: Customer = {
    id: crypto.randomUUID(),
    numero: generateCustomerNumber(customers),
    ...input,
    statut: "ACTIF",
    dateCreation: new Date().toISOString(),
  };

  customers.push(customer);
  saveCustomers(customers);

  return customer;
}

export function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
): Customer {
  const customers = getStoredCustomers();
  const index = customers.findIndex((customer) => customer.id === id);

  if (index === -1) {
    throw new Error("Le client demandé est introuvable.");
  }

  const updatedCustomer: Customer = {
    ...customers[index],
    ...input,
  };

  if (!updatedCustomer.telephone.trim()) {
    throw new Error("Le numéro de téléphone est obligatoire.");
  }

  if (
    updatedCustomer.type === "PARTICULIER" &&
    !updatedCustomer.nom.trim()
  ) {
    throw new Error("Le nom du client est obligatoire.");
  }

  if (
    updatedCustomer.type === "ENTREPRISE" &&
    !updatedCustomer.nomEntreprise.trim()
  ) {
    throw new Error("Le nom de l'entreprise est obligatoire.");
  }

  customers[index] = updatedCustomer;
  saveCustomers(customers);

  return updatedCustomer;
}

export function deleteCustomer(id: string): void {
  const customers = getStoredCustomers();
  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    throw new Error("Le client demandé est introuvable.");
  }

  saveCustomers(customers.filter((item) => item.id !== id));
}

export function toggleCustomerStatus(id: string): Customer {
  const customers = getStoredCustomers();
  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    throw new Error("Le client demandé est introuvable.");
  }

  customer.statut = customer.statut === "ACTIF" ? "INACTIF" : "ACTIF";

  saveCustomers(customers);

  return customer;
}
