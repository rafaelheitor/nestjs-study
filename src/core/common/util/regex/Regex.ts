export class Regex {
  static readonly PasswordRegex = new RegExp(
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
  );
}
