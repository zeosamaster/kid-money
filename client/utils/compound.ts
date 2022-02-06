import { withForm } from "./form";

function compound() {
  console.log("Going to compound");
}

export default withForm(compound);
