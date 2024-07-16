// graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_QUESTIONNAIRES = gql`
  query AllQuestionnaires {
    getQuestionnaires {
      id
      name
      introMessage
      questions {
        id
        label
        options {
          label
          value
        }
      }
    }
  }
`;
