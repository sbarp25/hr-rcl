const getInitials = (fullName) => {
  if (!fullName) return "?";

  // Split the name by spaces and filter out empty strings
  const nameParts = fullName.split(" ").filter((part) => part.trim() !== "");

  if (nameParts.length === 0) return "?";
  if (nameParts.length === 1) return nameParts[0].charAt(0);

  // Get first character of first name
  const firstInitial = nameParts[0].charAt(0);

  const middleInitial = nameParts[1].charAt(0);
  const lastInitial = nameParts[nameParts.length - 1].charAt(0);

  if (nameParts.length > 2) {
    return `${firstInitial}${middleInitial}${lastInitial}`;
  } else {
    return `${firstInitial}${lastInitial}`;
  }
};

export default getInitials;
