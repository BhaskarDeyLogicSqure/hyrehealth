import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";

// Dynamic imports for theme components
//  --------- Default Theme ---------
const DefaultCategoriesPage = dynamic(
  () => import("@/themes/default/TreatmentCategories"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    ),
  }
);

//  --------- Modern Theme ---------
const ModernCategoriesPage = dynamic(
  () => import("@/themes/modern/ModernCategoriesPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    ),
  }
);

// --------- Add more theme exports here ---------

const CategoriesPage = () => {
  // Get current theme from cookie store
  const cookieStore = cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  const ThemeComponents = {
    default: DefaultCategoriesPage,
    modern: ModernCategoriesPage,
  };

  const SelectedComponent = ThemeComponents[theme] || DefaultCategoriesPage;

  return <SelectedComponent />;
};

export default CategoriesPage;
