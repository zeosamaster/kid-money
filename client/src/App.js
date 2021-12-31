import React from "react";
import TokenContract from "./contracts/Token.json";
import BankContract from "./contracts/Bank.json";
import getWeb3 from "./getWeb3";

import "./App.css";

function App() {
  const [state, setState] = React.useState({
    web3: null,
    accounts: null,
    contract: null,
  });

  React.useEffect(() => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TokenContract.networks[networkId];
      const contract = new web3.eth.Contract(
        TokenContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      setState({ web3, accounts, contract }, runExample);
    } catch (error) {
      console.error(
        `Failed to load web3, accounts, or contract. Check console for details.`,
        error
      );
    }
  }, []);

  const runExample = React.useCallback(async () => {
    const { accounts, contract } = state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    setState({ storageValue: response });
  }, [state]);

  if (!state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return <div className="App"></div>;
}

export default App;
