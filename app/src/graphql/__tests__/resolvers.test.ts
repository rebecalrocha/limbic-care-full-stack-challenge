import { resolvers, UserInfo } from "../resolvers";
import Questionnaire from "../../../db/models/questionnaire";
import QuestionnaireResponse from "../../../db/models/questionnaireResponse";
import Response from "../../../db/models/response";
import User from "../../../db/models/user";
import Question from "../../../db/models/question";

describe("Resolvers", () => {
  describe("Query", () => {
    test("getQuestionnaire resolver", async () => {
      const mockName = "Sample Questionnaire";

      const mockQuestionnaire = {
        id: 1,
        name: mockName,
        questions: [
          { id: 1, text: "Question 1", options: [{ id: 1, text: "Option 1" }] },
          { id: 2, text: "Question 2", options: [{ id: 2, text: "Option 2" }] },
        ],
      };

      Questionnaire.query = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockQuestionnaire),
      });

      const result = await resolvers.Query.getQuestionnaire(null, {
        name: mockName,
      });

      expect(result).toEqual(mockQuestionnaire);
    });

    test("getUserResponses resolver", async () => {
      const mockUserId = 1;
      const mockQuestionnaireId = 1;

      const mockUserResponses = {
        userId: mockUserId,
        questionnaireId: mockQuestionnaireId,
        responses: [{ id: 1, questionId: 1, value: 5 }],
      };

      QuestionnaireResponse.query = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockUserResponses),
      });

      const result = await resolvers.Query.getUserResponses(null, {
        userId: mockUserId,
        questionnaireId: mockQuestionnaireId,
      });

      expect(result).toEqual(mockUserResponses);
    });
  });

  describe("Mutation", () => {
    test("Start Questionnaire Resolver", async () => {
      const mockName = "John Doe";
      const mockQuestionnaireName = "Sample Questionnaire";

      User.query = jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ id: 1 }),
      });

      Questionnaire.query = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 1 }),
      });

      QuestionnaireResponse.query = jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ id: 1 }),
      });

      const result = await resolvers.Mutation.startQuestionnaire(null, {
        name: mockName,
        questionnaireName: mockQuestionnaireName,
      });

      expect(result).toEqual({ userId: 1, questionnaireResponseId: 1 });
    });

    test.skip("Submit Answer Resolver", async () => {
      const mockQuestionnaireResponseId = 1;
      const mockQuestionId = 1;
      const mockValue = 5;

      QuestionnaireResponse.query = jest.fn().mockReturnValue({
        findById: jest.fn().mockResolvedValue({
          id: mockQuestionnaireResponseId,
          questionnaireId: 1,
          totalValue: 0,
        }),
      });

      Question.query = jest.fn().mockReturnValue({
        findById: jest.fn().mockResolvedValue({
          id: mockQuestionId,
          questionnaireId: 1,
        }),
      });

      Response.query = jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ id: 1 }),
      });

      QuestionnaireResponse.query = jest.fn().mockReturnValue({
        patch: jest.fn().mockResolvedValue({}),
      });

      const result = await resolvers.Mutation.submitAnswer(null, {
        questionnaireResponseId: mockQuestionnaireResponseId,
        questionId: mockQuestionId,
        value: mockValue,
      });

      expect(result).toBeDefined();
    });

    test.skip("Reset Questionnaire Resolver", async () => {
      const mockUserId = 1;
      const mockQuestionnaireId = 1;

      QuestionnaireResponse.query = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 1 }),
      });

      Response.query = jest.fn().mockReturnValue({
        delete: jest.fn().mockResolvedValue({}),
      });

      QuestionnaireResponse.query = jest.fn().mockReturnValue({
        deleteById: jest.fn().mockResolvedValue({}),
      });

      const result = await resolvers.Mutation.resetQuestionnaire(null, {
        userId: mockUserId,
        questionnaireId: mockQuestionnaireId,
      });

      expect(result).toEqual({ userId: mockUserId });
    });

    test("Update User Info Resolver", async () => {
      const mockUserId = 1;
      const mockUserInfo: UserInfo = {
        name: "John Doe",
        phoneNumber: "123456789",
        dateOfBirth: new Date(),
        email: "john.doe@example.com",
        consentToPush: true,
        consentToEmail: true,
        consentToCall: false,
      };

      User.query = jest.fn().mockReturnValue({
        findById: jest.fn().mockReturnValue({
          update: jest.fn().mockResolvedValue({}),
        }),
      });

      const result = await resolvers.Mutation.updateUserInfo(null, {
        userId: mockUserId,
        userInfo: mockUserInfo,
      });

      expect(result).toEqual({ userId: mockUserId });
    });
  });
});
