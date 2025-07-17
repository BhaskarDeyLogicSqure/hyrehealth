import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";

// Dynamic imports for theme components
//  --------- Default Theme ---------
const DefaultProductsPage = dynamic(
  () => import("@/themes/default/Products/ServerPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    ),
  }
);

//  --------- Modern Theme ---------
// TODO: Implement ModernProductsPage when needed
// const ModernProductsPage = dynamic(
//   () => import("@/themes/modern/ModernProductsPage"),
//   {
//     loading: () => (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     ),
//   }
// );

// --------- Add more theme exports here ---------

const ProductsPage = ({ searchParams }: { searchParams: any }) => {
  // Get current theme from cookie store
  const cookieStore = cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  const ThemeComponents = {
    default: DefaultProductsPage,
    // modern: ModernProductsPage, // TODO: Uncomment when ModernProductsPage is implemented
  } as const;

  const SelectedComponent =
    ThemeComponents[theme as keyof typeof ThemeComponents] ||
    DefaultProductsPage;

  return <SelectedComponent searchParams={searchParams} />;
};

export default ProductsPage;
