import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";

// Dynamic imports for theme components
//  --------- Default Theme ---------
const DefaultProductDetailsPage = dynamic(
  () => import("@/themes/default/Products/ProductDetailsPage"),
  {
    loading: () => (
      <div className="min-h-screen theme-bg">
        <div className="container mx-auto px-4 py-8">
          <ThemeLoader
            type="product-details"
            variant="product-details-skeleton"
            message="Loading product details..."
          />
        </div>
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
//       <div className="min-h-screen theme-bg">
//         <div className="container mx-auto px-4 py-8">
//           <ThemeLoader
//             type="product-details"
//             variant="product-details-skeleton"
//             message="Loading product details..."
//           />
//         </div>
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
