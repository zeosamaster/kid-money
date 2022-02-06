import { withFormAmount } from "./form";

function withdraw(amount: number) {
  console.log(`Going to withdraw ${amount}`);
}

export default withFormAmount(withdraw);
