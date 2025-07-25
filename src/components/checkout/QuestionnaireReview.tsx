import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { useCheckoutQuestionnaire } from "@/hooks/useCheckoutQuestionnaire";
import { QuestionType } from "@/types/questionnaire";

const QuestionnaireReview = () => {
  const {
    questionnaire,
    isFromQuestionnaire,
    eligibleProducts,
    ineligibleProducts,
    getEligibilityStatus,
    getQuestionnaireProgress,
    getProductResponses,
    eligibleProductsTotal,
  } = useCheckoutQuestionnaire();

  const eligibilityStatus = getEligibilityStatus();
  const progress = getQuestionnaireProgress();

  if (!isFromQuestionnaire) {
    return null; // Don't show if not coming from questionnaire
  }

  const renderAnswerValue = (answer: any, questionType: QuestionType) => {
    if (answer === null || answer === undefined) return "Not answered";

    switch (questionType) {
      case QuestionType.Checkbox:
        return Array.isArray(answer) ? answer.join(", ") : answer;
      case QuestionType.Boolean:
        return answer ? "Yes" : "No";
      case QuestionType.Date:
        return new Date(answer).toLocaleDateString();
      default:
        return String(answer);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "eligible":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "general_ineligible":
      case "no_eligible_products":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "eligible":
        return "Eligible for selected products";
      case "general_ineligible":
        return "Not eligible for treatment";
      case "no_eligible_products":
        return "No eligible products found";
      case "pending":
        return "Questionnaire incomplete";
      default:
        return "Unknown status";
    }
  };

  return (
    <div className="space-y-6">
      {/* Eligibility Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(eligibilityStatus)}
            Questionnaire Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {eligibleProducts.length}
              </div>
              <div className="text-sm text-gray-600">Eligible Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {ineligibleProducts.length}
              </div>
              <div className="text-sm text-gray-600">Ineligible Products</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Badge
              variant={
                eligibilityStatus === "eligible" ? "default" : "destructive"
              }
            >
              {getStatusText(eligibilityStatus)}
            </Badge>
            {questionnaire.completedAt && (
              <span className="text-sm text-gray-500">
                Completed on{" "}
                {new Date(questionnaire.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Eligible Products */}
      {eligibleProducts?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Eligible Products ({eligibleProducts?.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eligibleProducts?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{item?.product?.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item?.selectedOption?.dosageStrength}mg •{" "}
                      {item?.selectedOption?.duration} month(s)
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {item?.type === "main" ? "Main Product" : "Add-on"}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${item?.selectedOption?.price}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-semibold">
                  <span>Eligible Products Total:</span>
                  <span className="text-green-600">
                    ${eligibleProductsTotal}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ineligible Products */}
      {ineligibleProducts?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Ineligible Products ({ineligibleProducts?.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ineligibleProducts?.map((item, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{item?.product?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item?.selectedOption?.dosageStrength}mg •{" "}
                        {item?.selectedOption?.duration} month(s)
                      </p>
                      {item?.eligibilityData?.ineligibilityReason && (
                        <p className="text-sm text-red-600 mt-1">
                          Reason: {item?.eligibilityData?.ineligibilityReason}
                        </p>
                      )}
                    </div>
                    <Badge variant="destructive">Not Eligible</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Questionnaire Responses */}
      {questionnaire?.generalResponses?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>General Health Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questionnaire?.generalResponses?.map((response, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {response?.questionText}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {renderAnswerValue(
                        response?.answer,
                        response?.questionType
                      )}
                    </p>
                  </div>
                  {response?.isCorrect !== undefined && (
                    <div className="ml-4">
                      {response?.isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product-Specific Responses */}
      {questionnaire?.productEligibilities?.map((productEligibility, index) => {
        const productResponses = getProductResponses(
          productEligibility?.productId
        );
        return productResponses?.length > 0 ? (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {productEligibility?.isEligible ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {productEligibility?.productName} Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productResponses?.map((response, responseIndex) => (
                  <div
                    key={responseIndex}
                    className="flex items-start justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {response?.questionText}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {renderAnswerValue(
                          response?.answer,
                          response?.questionType
                        )}
                      </p>
                    </div>
                    {response?.isCorrect !== undefined && (
                      <div className="ml-4">
                        {response?.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null;
      })}
    </div>
  );
};

export default QuestionnaireReview;
