import { withFormAmount } from "./form";

function unsave(amount: number) {
  console.log(`Going to unsave ${amount}`);
}

export default withFormAmount(unsave);
