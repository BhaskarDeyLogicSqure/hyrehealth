import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";

// Dynamic imports for theme components
//  --------- Default Theme ---------
const DefaultProductsPage = dynamic(
  () => import("@/themes/default/Products/ServerPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center theme-bg">
        <ThemeLoader type="products" message="Loading products..." size="lg" />
      </div>
    ),
  }
);

//  --------- Classic Theme ---------
const ClassicProductsPage = dynamic(
  () => import("@/themes/classic/Products/ServerPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center theme-bg">
        <ThemeLoader type="products" message="Loading products..." size="lg" />
      </div>
    ),
  }
);

// --------- Add more theme exports here ---------

interface ProductsPageProps {
  searchParams: any;
}

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  // Get current theme from cookie store
  const cookieStore = cookies(); // get the cookie store
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  // Component mapping based on theme
  const ThemeComponents = {
    modern: DefaultProductsPage,
    classic: ClassicProductsPage,
  } as const;

  const SelectedComponent = ThemeComponents[theme] || DefaultProductsPage;

  return <SelectedComponent searchParams={searchParams} />;
};

export default ProductsPage;
