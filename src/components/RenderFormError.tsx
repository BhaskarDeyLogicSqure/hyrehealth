import React from "react";

const RenderFormError = ({
  errors,
  field,
}: {
  errors: Record<string, string | null>;
  field: string;
}) => {
  return errors?.[field] ? (
    <p className="text-red-500 text-sm">{errors?.[field]}</p>
  ) : null;
};

export default RenderFormError;
