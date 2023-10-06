export const getData = async (searchTerm: string) => {
  const response = await fetch(`/api/search?term=${searchTerm}`);
  console.log(response);
  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  } else {
    return await response.json();
  }
};
