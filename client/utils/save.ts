import { withFormAmount } from "./form";

function save(amount: number) {
  console.log(`Going to save ${amount}`);
}

export default withFormAmount(save);
