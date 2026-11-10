import { randomUUID } from "node:crypto";

import type { Credentials, NewUser } from "../api/models";

export const UserFactory = {
  build(overrides: Partial<NewUser> = {}): NewUser {
    const unique = randomUUID().replaceAll("-", "").slice(0, 12);
    return {
      first_name: "Portfolio",
      last_name: "Tester",
      address: {
        street: "Gerritsenstraat",
        house_number: "42",
        city: "Oosthuizen",
        state: "Groningen",
        country: "NL",
        postal_code: "1234AB",
      },
      phone: "0612345678",
      dob: "1990-01-01",
      email: `qa-${unique}@example.com`,
      password: `Portfolio!${unique}Aa`,
      ...overrides,
    };
  },

  credentials(user: NewUser): Credentials {
    return { email: user.email, password: user.password };
  },
};
