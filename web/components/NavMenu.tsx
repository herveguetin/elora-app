import { Link } from "@remix-run/react";
import { NavMenu as AppBridgeNavMenu } from "@shopify/app-bridge-react";

export function NavMenu() {
  return (
    <AppBridgeNavMenu>
      <Link to="/" rel="home">
        Elora
      </Link>
      <Link to="/developer">
        Developer
      </Link>
    </AppBridgeNavMenu>
  );
}
