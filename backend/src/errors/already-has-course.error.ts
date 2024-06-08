export class AlreadyHasCourseError extends Error {
  constructor(topicId: number) {
    super(`El Tema ${topicId} ya tiene un curso asociado.`);
  }
}
