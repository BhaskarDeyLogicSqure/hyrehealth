import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePicker } from "../ui/DatePicker";
import { Upload, File } from "lucide-react";
import { formatDate } from "@/lib/dayjs";
import { getFileSize } from "@/lib/utils";
import { IntakeFormQuestion } from "@/types/intakeForms";
import { QuestionType } from "@/types/questionnaire";
import { Checkbox } from "../ui/checkbox";

interface IntakeFormCardProps {
  currentStep: number;
  responses: Record<string, any>;
  questions: IntakeFormQuestion[];
  getCurrentQuestion: () => IntakeFormQuestion | null;
  updateResponse: (value: any) => void;
  handleNext: () => void;
  getCurrentQuestionId: () => string;
}

const IntakeFormCard = ({
  currentStep,
  responses,
  questions,
  getCurrentQuestion,
  updateResponse,
  handleNext,
  getCurrentQuestionId,
}: IntakeFormCardProps) => {
  const _renderQuestion = () => {
    const currentQuestion = getCurrentQuestion();

    if (!currentQuestion) return null;

    const currentValue = responses?.[getCurrentQuestionId()];

    switch (currentQuestion?.question?.questionType) {
      case QuestionType.Text:
        return (
          <div>
            <Label
              htmlFor={getCurrentQuestionId()}
              className="theme-text-primary"
            >
              {currentQuestion?.question?.questionText}
            </Label>
            <Input
              id={getCurrentQuestionId()}
              type="text"
              placeholder={currentQuestion?.question?.helpText || ""}
              value={currentValue || ""}
              onChange={(e) => updateResponse(e.target.value)}
              className="mt-2"
            />
            {currentQuestion?.question?.helpText && (
              <p className="text-xs text-gray-500 mt-1">
                {currentQuestion?.question?.helpText}
              </p>
            )}
          </div>
        );

      case QuestionType.Number:
        return (
          <div>
            <Label
              htmlFor={getCurrentQuestionId()}
              className="theme-text-primary"
            >
              {currentQuestion?.question?.questionText}
              {currentQuestion?.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <Input
              id={getCurrentQuestionId()}
              type="number"
              placeholder={currentQuestion?.question?.helpText || ""}
              value={currentValue || ""}
              onChange={(e) => updateResponse(e.target.value)}
              className="mt-2"
            />
          </div>
        );

      case QuestionType.Radio:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.question?.questionText}
              {currentQuestion?.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <RadioGroup
              value={currentValue || ""}
              onValueChange={updateResponse}
              className="mt-2"
            >
              {currentQuestion?.question?.options?.map((option: any) => {
                const optionValue =
                  typeof option === "string" ? option : option?._id;
                const optionLabel =
                  typeof option === "string" ? option : option?.label;

                return (
                  <div
                    key={optionValue}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={optionValue} id={optionValue} />
                    <Label
                      htmlFor={optionValue}
                      className="theme-text-primary cursor-pointer"
                    >
                      {optionLabel}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );

      case QuestionType.Select:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.question?.questionText}
              {currentQuestion?.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <Select value={currentValue || ""} onValueChange={updateResponse}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion?.question?.options?.map((option: any) => {
                  const optionValue =
                    typeof option === "string" ? option : option?._id;
                  const optionLabel =
                    typeof option === "string" ? option : option?.label;

                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {optionLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );

      case QuestionType.Textarea:
        return (
          <div>
            <Label
              htmlFor={getCurrentQuestionId()}
              className="theme-text-primary"
            >
              {currentQuestion?.question?.questionText}
              {currentQuestion?.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={getCurrentQuestionId()}
              placeholder={currentQuestion?.question?.helpText || ""}
              value={currentValue || ""}
              onChange={(e) => updateResponse(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        );

      case QuestionType.Date:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.question?.questionText}
              {currentQuestion?.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <DatePicker
              date={currentValue ? new Date(currentValue) : undefined}
              onDateChange={(date) => {
                if (date) {
                  updateResponse(date?.toISOString());
                } else {
                  updateResponse(null);
                }
              }}
              placeholder={currentQuestion?.question?.helpText || "Pick a date"}
            />

            {currentValue && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Selected: {formatDate(currentValue, "MM/DD/YYYY")}
                </span>
              </div>
            )}

            {currentQuestion?.question?.helpText && (
              <p className="text-xs text-gray-500 mt-1">
                {currentQuestion?.question?.helpText}
              </p>
            )}
          </div>
        );

      case QuestionType.Dropdown:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.question?.questionText}
            </Label>
            <Select value={currentValue || ""} onValueChange={updateResponse}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion?.question?.options?.map((option) => {
                  const optionValue =
                    typeof option === "string" ? option : option?._id;
                  const optionLabel =
                    typeof option === "string" ? option : option?.label;
                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {optionLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );

      case QuestionType.Checkbox:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.question?.questionText}
            </Label>
            <div className="mt-2 space-y-2">
              {currentQuestion?.question?.options?.map((option) => {
                const optionValue =
                  typeof option === "string" ? option : option?._id;
                const optionLabel =
                  typeof option === "string" ? option : option?.label;

                return (
                  <div
                    key={optionValue}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={optionValue}
                      checked={currentValue?.includes(optionValue) || false}
                      onCheckedChange={(checked) => {
                        const newValue = currentValue || [];
                        if (checked) {
                          updateResponse([...newValue, optionValue]);
                        } else {
                          updateResponse(
                            newValue.filter(
                              (item: string) => item !== optionValue
                            )
                          );
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <Label
                      htmlFor={optionValue}
                      className="text-sm theme-text-primary cursor-pointer"
                    >
                      {optionLabel}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case QuestionType.File:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.question?.questionText}
              {currentQuestion?.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <div className="mt-2">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(
                    "border-blue-400",
                    "bg-blue-50"
                  );
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-blue-400",
                    "bg-blue-50"
                  );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-blue-400",
                    "bg-blue-50"
                  );
                  const files = e?.dataTransfer?.files;
                  if (files?.length > 0) {
                    const file = files?.[0];
                    updateResponse(file);
                  }
                }}
              >
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor={getCurrentQuestionId()}
                      className="cursor-pointer text-blue-600 hover:text-blue-500"
                    >
                      Choose file
                    </label>
                    <span className="text-gray-500"> or drag and drop</span>
                  </div>
                  {currentQuestion?.question?.helpText && (
                    <p className="text-xs text-gray-500">
                      {currentQuestion?.question?.helpText}
                    </p>
                  )}
                </div>

                <Input
                  id={getCurrentQuestionId()}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      updateResponse(file);
                    }
                  }}
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip,application/x-zip-compressed,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/json,application/xml,application/csv"
                />
              </div>

              {currentValue && (
                <div className="mt-2 flex items-center space-x-2 text-sm p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <File className="h-4 w-4 text-blue-600" />
                  <span className="flex-1">
                    {currentValue?.name?.length > 30
                      ? currentValue?.name?.slice(0, 15) +
                        "..." +
                        currentValue?.name?.slice(-10)
                      : currentValue?.name}
                  </span>

                  {currentValue?.size && (
                    <span className="text-xs text-gray-400">
                      ({getFileSize(currentValue?.size)})
                    </span>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateResponse(null)}
                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const _renderStep = () => {
    // Introduction step
    if (currentStep === 0) {
      return (
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              Intake Form
            </h1>
            <p className="theme-text-muted">
              Please complete this intake form to help us better understand your
              health needs and provide personalized care.
            </p>
            <p className="text-sm theme-text-muted mt-2">
              This form has {questions.length} questions and should take about{" "}
              {Math.ceil(questions.length / 2)} minutes to complete.
            </p>
          </div>

          <Button onClick={handleNext} className="w-full">
            Start Intake Form
          </Button>
        </div>
      );
    }

    // Question screen
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold theme-text-primary">
              Question {currentStep} of {questions?.length}
            </h1>
            <span className="text-sm theme-text-muted bg-gray-100 px-2 py-1 rounded">
              {currentStep} of {questions?.length}
            </span>
          </div>
          <p className="theme-text-muted">
            Please answer the following question to help us provide better care.
          </p>
        </div>

        {_renderQuestion()}
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-8">{_renderStep()}</CardContent>
    </Card>
  );
};

export default IntakeFormCard;
