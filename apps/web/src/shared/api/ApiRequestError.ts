export type FieldError = { field: string; message: string };

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: FieldError[];
  readonly traceId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors: FieldError[] = [],
    traceId?: string
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.traceId = traceId;
  }
}
