export class BResponse<T> {
  success: boolean;
  message?: string | undefined;
  data: T;
}