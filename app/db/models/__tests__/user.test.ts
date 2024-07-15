import User from "../user";
import knex from "../../../src/config/knex";

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
});

describe("User Response", () => {
  test("TODO: add user response model tests", async () => {
    const name = "test-name";

    const response = await User.query().insert({ name });

    expect(response).toHaveProperty("id");
    expect(response.name).toBe(name);
  });
});
