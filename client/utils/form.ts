export function withFormAmount(callback: (amount: number) => void) {
  return (e: any) => {
    e.preventDefault();

    const form = e.target;
    const amount = Number(form.amount.value);

    callback(amount);
  };
}

export function withForm(callback: () => void) {
  return (e: any) => {
    e.preventDefault();

    callback();
  };
}
