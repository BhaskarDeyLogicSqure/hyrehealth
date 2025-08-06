export enum QuestionType {
  Text = "text",
  Textarea = "textarea",
  Radio = "radio",
  Checkbox = "checkbox",
  Select = "select",
  Date = "date",
  Number = "number",
  Boolean = "boolean",
  Dropdown = "dropdown",
  File = "file",
}

export type QuestionnaireOption = {
  value: string;
  label: string;
  triggerAdditionalQuestions: boolean;
  additionalQuestions: any[]; // You can replace 'any' with a more specific type if available
  isCorrect: boolean;
  _id: string;
  id?: string;
};

export type Question = {
  _id: string;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  order: number;
  options: QuestionnaireOption[];
  helpText: string;
  medicalFlags: any[]; // You can replace 'any' with a more specific type if available
  associatedProducts: any[]; // You can replace 'any' with a more specific type if available
  scope: string;
  businessType: string;
  isActive: boolean;
  merchantSpecific: boolean;
  hasCorrectOption: boolean;
  __v: number;
  validationRules: Record<string, any>;
};
