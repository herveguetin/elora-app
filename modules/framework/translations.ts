import { CustomContext } from "types";
import { THEME_FILE } from "./graphql/Queries";

export const getTranslations = async (context: CustomContext): Promise<Record<string, string>> => {
  const shopify = context.connections.shopify.current!;
  const contextLocale = (context.locale || "fr").toLowerCase();
  const localeCode = contextLocale === "en" ? "en.default" : contextLocale!;
  const variables = {
    id: `gid://shopify/OnlineStoreTheme/${context.themeId}`,
    filenames: [`locales/${localeCode}.json`],
  };

  const translations = await shopify.graphql(THEME_FILE, variables);
  const content = translations.theme.files.nodes[0].body.content;
  const withoutComments = content.replace(/\/\*[\s\S]*?\*\//, "").trim();

  return JSON.parse(withoutComments);
};
