const translations = {
  APP_TITLE: "Kid Money",

  HEADER: {
    TITLE: "Kid Money!",
    DESCRIPTION: "Aqui vais poder gerir o teu dinheiro:",
    ACTIONS: {
      DEPOSIT: "depositar",
      WITHDRAW: "levantar",
      SAVE: "investir",
      UNSAVE: "desinvestir",
      COMPOUND: "ganhar juros",
    },
  },

  WALLET: {
    CONNECT: "Ligar a Carteira",
  },

  ACCOUNT_BALANCE: {
    TITLE: "Saldo",
    DEPOSIT: {
      HEADER: "Depositar",
      DESCRIPTION:
        "Deposita os teus tokens para poderes investir e ganhar juros",
    },
    WITHDRAW: {
      HEADER: "Levantar",
      DESCRIPTION: "Levanta os teus tokens para converteres para dinheiro",
    },
  },

  ACCOUNT_SAVINGS: {
    TITLE: "Investimentos",
    SAVINGS_DATE: "Data do último investimento",
    UNLOCK_DATE: "Data de desbloqueio dos investimentos",
    SAVE: {
      HEADER: "Investir",
      DESCRIPTION: "Investe os teus tokens para ganhares ainda mais tokens",
    },
    UNSAVE: {
      HEADER: "Desinvestir",
      DESCRIPTION:
        "Desinveste os teus tokens para decidires o que fazer com eles",
    },
  },

  ACCOUNT_COMPOUNDING: {
    TITLE: "Ganhar juros",
    COMPOUNDING_PERCENTAGE: "Percentagem de juro",
    MAX_COMPOUND_RETURN: "Máximo de retorno de juros",
    COMPOUND: {
      HEADER: "Ganhar Juros",
      DESCRIPTION: "Ganha juros sobre os teus investimentos",
    },
  },

  INPUT: {
    MAX: "MAX",
  },

  ALERT: {
    WRONG_NETWORK: {
      TITLE: "Rede errada",
      DESCRIPTION1: "O Kid Money não funciona na tua rede actual.",
      DESCRIPTION2: (networkName: string) =>
        `Clica aqui para mudares para a rede ${networkName}.`,
    },
  },
};

export default translations;
