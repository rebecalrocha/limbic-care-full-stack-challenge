import { resolvers } from "../resolvers";

describe("Resolvers", () => {
  describe("Mutation", () => {
    test("TODO: add mutation tests", async () => {
      await resolvers.Mutation.startQuestionnaire(null, {
        name: "",
      });

      expect(true).toBeTruthy();
    });
  });
});
