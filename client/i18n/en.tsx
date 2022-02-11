const translations = {
  APP_TITLE: "Kid Money",

  HEADER: {
    TITLE: "Kid Money",
    DESCRIPTION: "Here you'll be able to manage your money:",
    ACTIONS: {
      DEPOSIT: "deposit",
      WITHDRAW: "withdraw",
      SAVE: "save",
      UNSAVE: "unsave",
      COMPOUND: "compound",
    },
  },

  WALLET: {
    CONNECT: "Connect to Wallet",
  },

  ACCOUNT_BALANCE: {
    TITLE: "Account balance",
    DEPOSIT: {
      HEADER: "Deposit",
      DESCRIPTION: () => (
        <ul>
          <li>Deposit tokens</li>
          <li>Take tokens off your personal wallet</li>
          <li>Move them to your account balance</li>
        </ul>
      ),
    },
    WITHDRAW: {
      HEADER: "Withdraw",
      DESCRIPTION: () => (
        <ul>
          <li>Withdraw tokens</li>
          <li>Take tokens off your account balance</li>
          <li>Move them to your personal wallet</li>
        </ul>
      ),
    },
  },

  ACCOUNT_SAVINGS: {
    TITLE: "Account savings",
    SAVINGS_DATE: "Savings Date",
    UNLOCK_DATE: "Unlock Date",
    SAVE: {
      HEADER: "Save",
      DESCRIPTION: () => (
        <ul>
          <li>Save your tokens</li>
          <li>Take tokens off your account balance</li>
          <li>Move them to your account savings</li>
        </ul>
      ),
    },
    UNSAVE: {
      HEADER: "Unsave",
      DESCRIPTION: () => (
        <ul>
          <li>Unsave your tokens</li>
          <li>Take tokens off your account savings</li>
          <li>Move them to your account balance</li>
        </ul>
      ),
    },
  },

  ACCOUNT_COMPOUNDING: {
    TITLE: "Compounding",
    COMPOUNDING_PERCENTAGE: "Compound percentage",
    MAX_COMPOUND_RETURN: "Max compound return",
    COMPOUND_SAVE: {
      HEADER: "Compound and Save",
      DESCRIPTION: () => (
        <ul>
          <li>Compound your locked savings</li>
          <li>Put the returns on your account savings</li>
          <li>Enjoy compounding returns</li>
        </ul>
      ),
    },
    COMPOUND_RETURNS: {
      HEADER: "Compound and Withdraw returns",
      DESCRIPTION: () => (
        <ul>
          <li>Compound your locked savings</li>
          <li>Put the returns on your account balance</li>
          <li>Keep the same account savings</li>
        </ul>
      ),
    },
    COMPOUND_ALL: {
      HEADER: "Compound and Withdraw all",
      DESCRIPTION: () => (
        <ul>
          <li>Compound your locked savings</li>
          <li>Put the returns on your account balance</li>
          <li>Move all your account savings to your account balance</li>
        </ul>
      ),
    },
  },

  INPUT: {
    MAX: "MAX",
  },

  ALERT: {
    WRONG_NETWORK: {
      TITLE: "Wrong network detected",
      DESCRIPTION1: "Kid Money is not supported on the current network.",
      DESCRIPTION2: (networkName: string) =>
        `Click here to switch to the ${networkName} network.`,
    },
  },
};

export default translations;
