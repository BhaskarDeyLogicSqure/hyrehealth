"use client";

import useMerchantDetails from "@/api/auth/useMerchantDetails";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMerchantData } from "@/store/slices/merchantSlice";
import { MerchantNMIpaymentTokenResponse } from "@/types/auth";
import DefaultFooter from "@/themes/default/layout/DefaultFooter";
import ClassicFooter from "@/themes/classic/layout/ClassicFooter";
import { setDataInCookie } from "@/utils/auth";
import { DEFAULT_THEME } from "@/lib/theme-utils";

const DefaultFooterComponent = ({
  merchantData,
}: {
  merchantData: MerchantNMIpaymentTokenResponse["data"];
}) => {
  return <DefaultFooter merchantData={merchantData} />;
};

const ClassicFooterComponent = ({
  merchantData,
}: {
  merchantData: MerchantNMIpaymentTokenResponse["data"];
}) => {
  return <ClassicFooter merchantData={merchantData} />;
};

export function Footer() {
  const dispatch = useDispatch();

  // Call the hook at the component level, not inside a function
  const { merchantData: fetchedMerchantData, merchantDataError } =
    useMerchantDetails();

  useEffect(() => {
    if (merchantDataError) {
      console.error("Error fetching merchant data:", merchantDataError);
      return;
    }

    // update it with latest fetched merchant data
    if (fetchedMerchantData) {
      dispatch(setMerchantData(fetchedMerchantData));
      setDataInCookie("theme", fetchedMerchantData?.selectedTemplateType);
    }
  }, [fetchedMerchantData, merchantDataError, dispatch]);

  // prevent rendering of footer on auth pages
  const pathname = usePathname();
  if (pathname?.startsWith("/auth/")) {
    return null;
  }

  // Get current theme from cookie store
  const theme = fetchedMerchantData?.selectedTemplateType || DEFAULT_THEME;

  const ThemeComponents = {
    modern: DefaultFooterComponent,
    classic: ClassicFooterComponent,
  };

  const SelectedComponent = ThemeComponents[theme] || DefaultFooterComponent;

  return <SelectedComponent merchantData={fetchedMerchantData} />;
}
