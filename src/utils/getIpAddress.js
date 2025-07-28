export async function getIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip; // Returns the actual IPv4 address
  } catch (error) {
    return "127.0.0.1"; // Fallback to localhost if there's an error
  }
}
