export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class NotFoundDomainException extends DomainException {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundDomainException';
  }
}

export class UnauthorizedDomainException extends DomainException {
  constructor(message: string = 'Unauthorized operation') {
    super(message);
    this.name = 'UnauthorizedDomainException';
  }
}

export class ConflictDomainException extends DomainException {
  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictDomainException';
  }
}
