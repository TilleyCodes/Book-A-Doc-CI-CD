export const fetchJson = async (endpoint) => {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
};
