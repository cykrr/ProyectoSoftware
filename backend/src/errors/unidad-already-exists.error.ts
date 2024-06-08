export class UnidadAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Unidad con nombre ${name} ya existe en este tema`);
  }
}