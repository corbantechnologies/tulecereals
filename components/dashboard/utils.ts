export const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

export const formatCurrency = (amount: number | string, currency: string = "USD") => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(value)) return `${currency} 0.00`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
};
