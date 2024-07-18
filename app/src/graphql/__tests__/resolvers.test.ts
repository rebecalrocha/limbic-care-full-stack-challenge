import { resolvers, UserInfo } from "../resolvers";
import Questionnaire from "../../../db/models/questionnaire";
import QuestionnaireResponse from "../../../db/models/questionnaireResponse";
import Response from "../../../db/models/response";
import User from "../../../db/models/user";
import Question from "../../../db/models/question";

describe("Resolvers", () => {
  describe("Query", () => {
    test("Get Questionnaire Resolver", async () => {
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

    test("Get User Responses Resolver", async () => {
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

    test("Submit Answer Resolver", async () => {
      const mockUserId = 1;
      const mockQuestionId = 1;
      const mockValue = 5;
      const mockQuestion = { id: mockQuestionId, questionnaireId: 1 };
      const mockQuestionnaireResponse = {
        id: 1,
        userId: mockUserId,
        questionnaireId: 1,
        totalValue: 10,
      };
      const mockResponse = {
        id: 1,
        questionId: mockQuestionId,
        value: mockValue,
      };

      const questionQueryMock = jest.fn().mockResolvedValue(mockQuestion);
      Question.query = jest.fn().mockReturnValue({
        findById: questionQueryMock,
      });

      const questionnaireResponseQueryMock = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockQuestionnaireResponse),
        patch: jest.fn().mockReturnThis(),
        findById: jest.fn().mockResolvedValue({}),
      });
      QuestionnaireResponse.query = jest
        .fn()
        .mockReturnValue(questionnaireResponseQueryMock());

      const responseQueryMock = jest.fn().mockResolvedValue(mockResponse);
      Response.query = jest.fn().mockReturnValue({
        insert: responseQueryMock,
      });

      const result = await resolvers.Mutation.submitAnswer(null, {
        userId: mockUserId,
        questionId: mockQuestionId,
        value: mockValue,
      });

      expect(result).toEqual(mockResponse);
      expect(questionQueryMock).toHaveBeenCalledWith(mockQuestionId);
    });

    test.skip("Reset Questionnaire Resolver", async () => {
      const mockUserId = 1;
      const mockQuestionnaireId = 1;
      const mockQuestionnaireResponse = {
        id: 1,
        userId: mockUserId,
        questionnaireId: mockQuestionnaireId,
      };

      QuestionnaireResponse.query = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockQuestionnaireResponse),
      });

      Response.query = jest.fn().mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue({}),
      });

      QuestionnaireResponse.query = jest.fn().mockReturnValue({
        deleteById: jest.fn().mockResolvedValue({}),
      });

      User.query = jest.fn().mockReturnValue({
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
