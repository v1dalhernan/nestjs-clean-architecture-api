export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly fullName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static create(props: {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
  }): User {
    const now = new Date();
    return new User(
      props.id,
      props.email.toLowerCase().trim(),
      props.passwordHash,
      props.fullName.trim(),
      now,
      now,
    );
  }
}
