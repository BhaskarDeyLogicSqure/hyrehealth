import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";

// Dynamic imports for theme components
//  --------- Default Theme ---------
const DefaultProductDetailsPage = dynamic(
  () => import("@/themes/default/ProductDetailsPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    ),
  }
);

//  --------- Modern Theme ---------
// TODO: Implement ModernProductDetailsPage when needed
// const ModernProductDetailsPage = dynamic(
//   () => import("@/themes/modern/ModernProductDetailsPage"),
//   {
//     loading: () => (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     ),
//   }
// );

// --------- Add more theme exports here ---------

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

const ProductDetailsPage = ({ params }: ProductDetailsPageProps) => {
  // Get current theme from cookie store
  const cookieStore = cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  const ThemeComponents = {
    default: DefaultProductDetailsPage,
    // modern: ModernProductDetailsPage, // TODO: Uncomment when ModernProductDetailsPage is implemented
  } as const;

  const SelectedComponent =
    ThemeComponents[theme as keyof typeof ThemeComponents] ||
    DefaultProductDetailsPage;

  return <SelectedComponent params={params} />;
};

export default ProductDetailsPage;
