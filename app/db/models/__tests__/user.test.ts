import User from "../user";
import initDB from "@limbic-chatbot/src/config/initDB";

beforeAll(() => initDB());

describe("User Response", () => {
  test("Insert User", async () => {
    const name = "test-name";

    const response = await User.query().insert({ name });

    expect(response).toHaveProperty("id");
    expect(response.name).toBe(name);
  });
});
