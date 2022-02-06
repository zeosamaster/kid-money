import { withFormAmount } from "./form";

function deposit(amount: number) {
  console.log(`Going to deposit ${amount}`);
}

export default withFormAmount(deposit);
