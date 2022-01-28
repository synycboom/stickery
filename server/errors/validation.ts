type ValidationErrorSpec = {
  msg: string,
  param: string,
  value?: string,
  location?: string,
}

export default class ValidationError extends Error {
  private errors: ValidationErrorSpec[];

  constructor(errors: ValidationErrorSpec[]) {
    super('ValidationError');
    this.name = 'ValidationError';
    this.errors = errors || [];
  }

  add(err: ValidationErrorSpec) {
    this.errors.push(err);
  }

  toResponse() {
    const { errors } = this;

    return {
      errors
    };
  }
}
