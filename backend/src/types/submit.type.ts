export interface SubmitResponseInput {
  answers: {
    questionId: string;
    selectedOption: string;
  }[];
}