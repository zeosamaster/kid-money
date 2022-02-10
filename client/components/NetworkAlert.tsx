import React from "react";
import { I18nContext } from "../context/I18nContext";
import { switchNetwork } from "../utils/metamask";
import { supportedNetworks } from "../utils/networks";
import Alert from "./Alert";
import Link from "./Link";

export default function NetworkAlert() {
  const _ = React.useContext(I18nContext);
  const [networkId, networkName] = Object.entries(supportedNetworks)[0];

  const switchToValidNetwork = React.useCallback(async () => {
    await switchNetwork(`0x${networkId}`);
  }, [networkId]);

  const title = _("ALERT.WRONG_NETWORK.TITLE");
  const body = (
    <>
      <p>{_("ALERT.WRONG_NETWORK.DESCRIPTION1")}</p>

      <p>
        <Link onClick={switchToValidNetwork}>
          {_("ALERT.WRONG_NETWORK.DESCRIPTION2", networkName)}
        </Link>
      </p>
    </>
  );

  return <Alert title={title} body={body} />;
}
