import { CustomContext } from "types";
import { CsvRow, parseCsvFile } from "../framework";
import { METAFIELDS_FILEPATH } from "./config";
import { CREATE_METAFIELD_DEFINITION, DELETE_METAFIELD_DEFINITION } from "./graphql/Mutations";
import { MetafieldDefinitionVariables } from "./types";
import { METAFIELD_DEFINITIONS_LIST } from "./graphql/Queries";

const usedNamespace = "site";

export const removeMetafields = async (context: CustomContext): Promise<Error[]> => {
  type Node = {
    id: string;
    namespace: string;
  };
  const shopify = context.connections.shopify.current!;
  const variables = { ownerType: "PRODUCT", first: 250 };
  const { metafieldDefinitions: result } = await shopify.graphql(METAFIELD_DEFINITIONS_LIST, variables);
  const toRemove: Node[] = result.nodes.filter((node: Node) => node.namespace === usedNamespace);
  await Promise.all(
    toRemove.map(async (node) => shopify.graphql(DELETE_METAFIELD_DEFINITION, { id: node.id }))
  );

  return [];
};

export const importMetafields = async (context: CustomContext): Promise<Error[]> => {
  const errors: Error[] = [];
  const fullCsv = await parseCsvFile(METAFIELDS_FILEPATH);
  const csv = fullCsv.filter((row) => row.code_shopify_uniquement_si_metafield !== "");

  // Map rows to promises
  const promises = csv.map(async (row) => {
    const variables = makeVariables(row);
    try {
      await createMetafieldDefition(context, row, variables, errors);
    } catch (e: any) {
      errors.push({ name: "[metafields] import error", message: e.message });
      context.logger.error({ e });
    }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  return errors;
};

const makeVariables = (row: CsvRow) => {
  const key = row.code_shopify_uniquement_si_metafield;
  const type = [
    row.nombre_de_valeurs.includes("1") ? "" : "list.", // "1" as in "1 seule valeur" for the nombre_de_valeurs field value
    row.metafields_data_type_shopify_ne_pas_toucher,
  ].join("");

  const variables = {
    definition: {
      key,
      name: row.nom_fonctionnel,
      namespace: usedNamespace,
      ownerType: row.type_de_resource_shopify_uniquement_si_metafield,
      type,
    },
  };

  return variables;
};

const createMetafieldDefition = async (
  context: CustomContext,
  row: CsvRow,
  variables: MetafieldDefinitionVariables,
  errors: Error[]
) => {
  const shopify = context.connections.shopify.current!;
  const { metafieldDefinitionCreate: result } = await shopify.graphql(CREATE_METAFIELD_DEFINITION, variables);
  const resultErrors = result.userErrors.filter((error: { code: string }) => error.code !== "TAKEN");
  if (resultErrors.length) {
    context.logger.error(
      { errors: resultErrors, variables },
      `[metafield] Import row error: ${variables.definition.key}`
    );
    resultErrors.map(() =>
      errors.push({
        name: "[metafield] Import row error",
        message: `Error while importing "${row.nom_fonctionnel}". Please see logs.`,
      })
    );
  }
};
