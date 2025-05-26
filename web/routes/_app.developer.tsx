import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Layout,
  List,
  Page,
  Text,
} from "@shopify/polaris";
import { useState } from "react";

enum Operation {
  CREATE,
  REMOVE_UNPINNED,
}

export default function Developer() {
  const [metafieldsLoading, setMetafieldsLoading] = useState(false);
  const [metafieldsShowBanner, setMetafieldsShowBanner] = useState(false);
  const [metafieldsErrors, setMetafieldsError] = useState<Error[]>([]);

  const run = async (operation: Operation) => {
    setMetafieldsLoading(true);
    setMetafieldsShowBanner(false);

    const path = operation === Operation.CREATE ? "/metafield/create" : "/metafield/remove";
    const { errors } = await (await fetch(path, { method: "POST" })).json();

    setMetafieldsError(errors);
    setMetafieldsLoading(false);
    setMetafieldsShowBanner(true);
  };

  return (
    <Page title="Developer">
      <Layout>
        <Layout.Section>
          <Card>
            <Box>
              <BlockStack gap="500">
                {metafieldsShowBanner && metafieldsErrors.length === 0 && (
                  <Banner
                    title="Metafields operation was successfully processed."
                    tone="success"
                    onDismiss={() => setMetafieldsShowBanner(false)}
                  />
                )}
                {metafieldsShowBanner && metafieldsErrors.length > 0 && (
                  <Banner
                    title="Metafields operation experienced the following error(s)."
                    tone="warning"
                    onDismiss={() => setMetafieldsShowBanner(false)}
                  >
                    <List>
                      {metafieldsErrors.map((error, i) => (
                        <List.Item key={i}>{error.message}</List.Item>
                      ))}
                    </List>
                  </Banner>
                )}
                <InlineStack>
                  <Text variant="headingMd" as="h2">
                    Metafields
                  </Text>
                </InlineStack>
                <InlineStack>
                  <BlockStack gap="300">
                    <InlineStack align="start" gap="200">
                      <Button
                        variant="primary"
                        onClick={() => run(Operation.CREATE)}
                        loading={metafieldsLoading}
                      >
                        Import metafields
                      </Button>
                      <Button
                        variant="primary"
                        tone="critical"
                        onClick={() => run(Operation.REMOVE_UNPINNED)}
                        loading={metafieldsLoading}
                      >
                        Remove metafields
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </InlineStack>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
