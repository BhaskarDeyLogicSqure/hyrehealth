import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";

// Dynamic imports for theme components
//  --------- Default Theme ---------
const DefaultCategoriesPage = dynamic(
  () => import("@/themes/default/TreatmentCategories/ServerPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center theme-bg">
        <ThemeLoader
          type="categories"
          message="Loading categories..."
          size="lg"
        />
      </div>
    ),
  }
);

//  --------- Modern Theme ---------
const ModernCategoriesPage = dynamic(
  () => import("@/themes/modern/ModernCategoriesPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center theme-bg">
        <ThemeLoader
          type="categories"
          message="Loading categories..."
          size="lg"
        />
      </div>
    ),
  }
);

// --------- Add more theme exports here ---------

const CategoriesPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // Get current theme from cookie store
  const cookieStore = cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  const ThemeComponents = {
    default: DefaultCategoriesPage,
    modern: ModernCategoriesPage,
  };

  const SelectedComponent = ThemeComponents[theme] || DefaultCategoriesPage;

  return <SelectedComponent searchParams={searchParams} />;
};

export default CategoriesPage;
