// src/lib/fetch-service.ts
const fetchData = async (query: string) => {
  try {
    const response = await fetch("http://localhost:1337/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    return await response.json();
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
};

export default fetchData;
