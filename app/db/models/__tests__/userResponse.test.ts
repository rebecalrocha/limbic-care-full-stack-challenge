import UserResponse from "../userResponse";
import knex from "../../../src/config/knex";

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
});

describe("User Response", () => {
  test("TODO: add user response model tests", async () => {
    const sessionId = "test-session";
    const question = 1;
    const answer = "test-answer";

    const response = await UserResponse.query().insert({
      sessionId,
      question,
      answer,
    });

    expect(response).toHaveProperty("id");
    expect(response.sessionId).toBe(sessionId);
    expect(response.question).toBe(question);
    expect(response.answer).toBe(answer);
  });
});
