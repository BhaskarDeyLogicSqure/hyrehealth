import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { resolveAllowPatientSelectDosage } from "@/configs";

/**
 * Resolves whether the merchant lets the patient pick their own dosage + duration
 * combo, from the `/payment/merchant-nmi-key` response
 * (merchantData.allowPatientSelectDosage), falling back to the env override and
 * then the default. See `resolveAllowPatientSelectDosage` for the full precedence.
 *
 * - true  → Previous (Mechanism A): patient picks a dosage + duration combo.
 * - false → Current (Mechanism B): flat appointment fee only.
 */
export const useAllowPatientSelectDosage = (): boolean => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  return resolveAllowPatientSelectDosage(merchantData?.allowPatientSelectDosage);
};

export default useAllowPatientSelectDosage;
