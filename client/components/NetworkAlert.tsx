import React from "react";
import { switchNetwork } from "../utils/metamask";
import { supportedNetworks } from "../utils/networks";
import Alert from "./Alert";
import Link from "./Link";

export default function NetworkAlert() {
  const [networkId, networkName] = Object.entries(supportedNetworks)[0];

  const switchToValidNetwork = React.useCallback(async () => {
    await switchNetwork(`0x${networkId}`);
  }, [networkId]);

  const title = "Wrong network detected";
  const body = (
    <>
      <p>Kid Money is not supported on the current network. </p>

      <p>
        <Link onClick={switchToValidNetwork}>
          Click here to switch to the {networkName} network.
        </Link>
      </p>
    </>
  );

  return <Alert title={title} body={body}></Alert>;
}
