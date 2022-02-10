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
      DESCRIPTION: "Deposit your tokens to be able to save & compound",
    },
    WITHDRAW: {
      HEADER: "Withdraw",
      DESCRIPTION: "Withdraw tokens to convert them to money you can spend",
    },
  },

  ACCOUNT_SAVINGS: {
    TITLE: "Account savings",
    SAVINGS_DATE: "Savings Date",
    UNLOCK_DATE: "Unlock Date",
    SAVE: {
      HEADER: "Save",
      DESCRIPTION: "Save your tokens to get even more tokens",
    },
    UNSAVE: {
      HEADER: "Unsave",
      DESCRIPTION:
        "Unsave your tokens so you can decide what else to do with them",
    },
  },

  ACCOUNT_COMPOUNDING: {
    TITLE: "Compounding",
    COMPOUNDING_PERCENTAGE: "Compound percentage",
    MAX_COMPOUND_RETURN: "Max compound return",
    COMPOUND: {
      HEADER: "Compound",
      DESCRIPTION: "Compound your locked savings to enjoy growing returns",
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
