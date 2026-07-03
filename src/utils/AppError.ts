export class AppError {
  message: string;
  status: number;

  constructor(message: string, status = 400) {
    ((this.message = message), (this.status = status));
  }
}