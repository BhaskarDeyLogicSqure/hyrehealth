import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";

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

//  --------- Classic Theme ---------
const ClassicCategoriesPage = dynamic(
  () => import("@/themes/classic/TreatmentCategories/ServerPage"),
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

interface CategoriesPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const CategoriesPage = ({ searchParams }: CategoriesPageProps) => {
  // Get current theme from cookie store
  const cookieStore = cookies(); // get the cookie store
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  // Component mapping based on theme
  const ThemeComponents = {
    modern: DefaultCategoriesPage,
    classic: ClassicCategoriesPage,
  };

  const SelectedComponent = ThemeComponents[theme] || DefaultCategoriesPage;

  return <SelectedComponent searchParams={searchParams} />;
};

export default CategoriesPage;
