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

export default function Index() {

  return (
    <Page title="Elora">
      <Layout>
        <Layout.Section>
          <Card>
            <p>Bienvenue !</p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
