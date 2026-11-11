
import type {
  AppUser,
  CreateUserInput,
  UpdateUserInput,
} from "./users.types";

const STORAGE_KEY = "cacao-sambirano-users";

const HASH_ITERATIONS = 310_000;
const MIN_PASSWORD_LENGTH = 10;

const RESERVED_EMAILS = [
  "admin@cacao.mg",
  "production@cacao.mg",
  "stock@cacao.mg",
  "commercial@cacao.mg",
  "compta@cacao.mg",
];

interface StoredUser extends AppUser {
  passwordSalt: string;
  passwordHash: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? (JSON.parse(stored) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function toPublicUser(user: StoredUser): AppUser {
  const {
    passwordSalt: _passwordSalt,
    passwordHash: _passwordHash,
    ...publicUser
  } = user;

  return publicUser;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function generateSalt(): string {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));

  return bufferToHex(saltBytes.buffer as ArrayBuffer);
}

async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: HASH_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return bufferToHex(hash);
}

function validateNewPassword(password: string): void {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      "Le mot de passe doit contenir au moins 10 caractères.",
    );
  }
}

async function createPasswordCredentials(password: string) {
  validateNewPassword(password);

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  return {
    passwordSalt,
    passwordHash,
  };
}

export function getUsers(): AppUser[] {
  return getStoredUsers().map(toPublicUser);
}

export async function createUser(
  input: CreateUserInput,
): Promise<AppUser> {
  const users = getStoredUsers();
  const email = normalizeEmail(input.email);

  const emailExists = users.some(
    (user) => normalizeEmail(user.email) === email,
  );

  if (emailExists || RESERVED_EMAILS.includes(email)) {
    throw new Error("Cette adresse email est déjà utilisée.");
  }

  if (!input.nom.trim()) {
    throw new Error("Le nom complet est obligatoire.");
  }

  const credentials = await createPasswordCredentials(input.password);

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    nom: input.nom.trim(),
    email,
    role: input.role,
    actif: true,
    dateCreation: new Date().toISOString(),
    ...credentials,
  };

  saveUsers([...users, newUser]);

  return toPublicUser(newUser);
}

export async function authenticateStoredUser(
  email: string,
  password: string,
): Promise<AppUser | null> {
  const normalizedEmail = normalizeEmail(email);

  const user = getStoredUsers().find(
    (item) => normalizeEmail(item.email) === normalizedEmail,
  );

  if (!user || !user.actif || !user.passwordSalt || !user.passwordHash) {
    return null;
  }

  const attemptedHash = await hashPassword(
    password,
    user.passwordSalt,
  );

  if (attemptedHash !== user.passwordHash) {
    return null;
  }

  return toPublicUser(user);
}

export async function changeOwnPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const users = getStoredUsers();

  const user = users.find((item) => item.id === userId);

  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  if (!user.actif) {
    throw new Error("Ce compte est désactivé.");
  }

  const currentHash = await hashPassword(
    currentPassword,
    user.passwordSalt,
  );

  if (currentHash !== user.passwordHash) {
    throw new Error("Votre ancien mot de passe est incorrect.");
  }

  if (currentPassword === newPassword) {
    throw new Error(
      "Le nouveau mot de passe doit être différent de l'ancien.",
    );
  }

  const credentials = await createPasswordCredentials(newPassword);

  const updatedUsers = users.map((item) =>
    item.id === userId
      ? {
          ...item,
          ...credentials,
        }
      : item,
  );

  saveUsers(updatedUsers);
}

export async function resetUserPassword(
  userId: string,
  newPassword: string,
): Promise<void> {
  const users = getStoredUsers();

  const user = users.find((item) => item.id === userId);

  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  const credentials = await createPasswordCredentials(newPassword);

  const updatedUsers = users.map((item) =>
    item.id === userId
      ? {
          ...item,
          ...credentials,
        }
      : item,
  );

  saveUsers(updatedUsers);
}

export function updateUser(
  id: string,
  input: UpdateUserInput,
): AppUser {
  const users = getStoredUsers();

  const userExists = users.some((user) => user.id === id);

  if (!userExists) {
    throw new Error("Utilisateur introuvable.");
  }

  const email = normalizeEmail(input.email);

  const emailExists = users.some(
    (user) =>
      user.id !== id &&
      normalizeEmail(user.email) === email,
  );

  if (emailExists || RESERVED_EMAILS.includes(email)) {
    throw new Error("Cette adresse email est déjà utilisée.");
  }

  if (!input.nom.trim()) {
    throw new Error("Le nom complet est obligatoire.");
  }

  const updatedUsers = users.map((user) =>
    user.id === id
      ? {
          ...user,
          nom: input.nom.trim(),
          email,
          role: input.role,
          actif: input.actif,
        }
      : user,
  );

  saveUsers(updatedUsers);

  const updatedUser = updatedUsers.find((user) => user.id === id);

  if (!updatedUser) {
    throw new Error("Impossible de récupérer l'utilisateur modifié.");
  }

  return toPublicUser(updatedUser);
}

export function deleteUser(id: string): void {
  const users = getStoredUsers();

  saveUsers(users.filter((user) => user.id !== id));
}
