import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";

// Dynamic imports for theme components
//  --------- Default Theme ---------
const DefaultNotFoundPage = dynamic(
  () => import("@/themes/default/NotFoundPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    ),
  }
);

//  --------- Modern Theme ---------
// TODO: Implement ModernNotFoundPage when needed
// const ModernNotFoundPage = dynamic(
//   () => import("@/themes/modern/ModernNotFoundPage"),
//   {
//     loading: () => (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     ),
//   }
// );

// --------- Add more theme exports here ---------

const NotFound = () => {
  // Get current theme from cookie store
  const cookieStore = cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  const ThemeComponents = {
    default: DefaultNotFoundPage,
    // modern: ModernNotFoundPage, // TODO: Uncomment when ModernNotFoundPage is implemented
  } as const;

  const SelectedComponent =
    ThemeComponents[theme as keyof typeof ThemeComponents] ||
    DefaultNotFoundPage;

  return <SelectedComponent />;
};

export default NotFound;
