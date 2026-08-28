import { questions } from "@/data/questions";
import type { StoredAnswers } from "@/types/diagnosis";

export class AnswerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnswerValidationError";
  }
}

export function validateAnswers(value: unknown): number[][] {
  if (!Array.isArray(value) || value.length !== questions.length) {
    throw new AnswerValidationError("すべての質問に回答してください。");
  }

  return value.map((group, questionIndex) => {
    const question = questions[questionIndex];
    if (!Array.isArray(group) || group.length === 0) throw new AnswerValidationError("すべての質問に回答してください。");
    if (!question.multiple && group.length !== 1) throw new AnswerValidationError("回答内容が正しくありません。");

    const indexes = group.map(Number);
    if (
      indexes.some((index) => !Number.isInteger(index) || index < 0 || index >= question.options.length) ||
      new Set(indexes).size !== indexes.length
    ) {
      throw new AnswerValidationError("回答内容が正しくありません。");
    }

    const noneIndex = question.options.findIndex((option) => option.label === "特にない");
    if (noneIndex >= 0 && indexes.includes(noneIndex) && indexes.length > 1) {
      throw new AnswerValidationError("「特にない」は単独で選択してください。");
    }
    return indexes;
  });
}

export function toStoredAnswers(answers: number[][]): StoredAnswers {
  return Object.fromEntries(
    questions.map((question, index) => [
      question.id,
      {
        selectedOptionIndexes: answers[index],
        selectedOptionLabels: answers[index].map((optionIndex) => question.options[optionIndex].label)
      }
    ])
  );
}
