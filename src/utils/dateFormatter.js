export const formattedDate = (date) => {
    if (!date) return 
    const d = new Date(date)
    if (isNaN(d)) return "Invalid date"
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }