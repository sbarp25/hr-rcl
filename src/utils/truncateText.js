const truncateText = (text, maxLength) =>
  text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
export default truncateText;
