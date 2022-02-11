const translations = {
  APP_TITLE: "Kid Money",

  HEADER: {
    TITLE: "Kid Money",
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
      DESCRIPTION: () => (
        <ul>
          <li>Deposita os teus tokens</li>
          <li>Retira tokens da tua carteira pessoal</li>
          <li>Deposita tokens no teu saldo</li>
        </ul>
      ),
    },
    WITHDRAW: {
      HEADER: "Levantar",
      DESCRIPTION: () => (
        <ul>
          <li>Levanta os teus tokens</li>
          <li>Retira tokens do teu saldo</li>
          <li>Deposita tokens na tua carteira pessoal</li>
        </ul>
      ),
    },
  },

  ACCOUNT_SAVINGS: {
    TITLE: "Investimentos",
    SAVINGS_DATE: "Data do último investimento",
    UNLOCK_DATE: "Data de desbloqueio dos investimentos",
    SAVE: {
      HEADER: "Investir",
      DESCRIPTION: () => (
        <ul>
          <li>Investe os teus tokens</li>
          <li>Retira tokens do teu saldo</li>
          <li>Deposita tokens nos teus investimentos</li>
        </ul>
      ),
    },
    UNSAVE: {
      HEADER: "Desinvestir",
      DESCRIPTION: () => (
        <ul>
          <li>Desinveste os teus tokens</li>
          <li>Retira tokens dos teus investimentos</li>
          <li>Deposita tokens no teu saldo</li>
        </ul>
      ),
    },
  },

  ACCOUNT_COMPOUNDING: {
    TITLE: "Ganhar juros",
    COMPOUNDING_PERCENTAGE: "Percentagem de juro",
    MAX_COMPOUND_RETURN: "Máximo de retorno de juros",
    COMPOUND_SAVE: {
      HEADER: "Investir juros",
      DESCRIPTION: () => (
        <ul>
          <li>Ganha juros sobre os teus investimentos</li>
          <li>Coloca o retorno nos teus investimentos</li>
          <li>Ganha juros cada vez maiores</li>
        </ul>
      ),
    },
    COMPOUND_RETURNS: {
      HEADER: "Depositar juros",
      DESCRIPTION: () => (
        <ul>
          <li>Ganha juros sobre os teus investimentos</li>
          <li>Coloca o retorno no teu saldo</li>
          <li>Mantém os mesmos investimentos</li>
        </ul>
      ),
    },
    COMPOUND_ALL: {
      HEADER: "Depositar tudo",
      DESCRIPTION: () => (
        <ul>
          <li>Ganha juros sobre os teus investimentos</li>
          <li>Coloca o retorno no teu saldo</li>
          <li>Move os teus investimentos para o teu saldo</li>
        </ul>
      ),
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
