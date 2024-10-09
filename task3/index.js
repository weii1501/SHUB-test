const axios = require("axios");

async function getInputData() {
  try {
    const response = await axios.get(
      "https://test-share.shub.edu.vn/api/intern-test/input"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching input data:", error);
    throw error;
  }
}

function processQueries(data, queries) {
  const results = [];
  for (const query of queries) {
    const { type, range } = query;
    const [l, r] = range;
    let result = 0;

    if (type === "1") {
      // Type 1: Calculate sum of the elements in range [l, r]
      result = data.slice(l, r + 1).reduce((sum, value) => sum + value, 0);
    } else if (type === "2") {
      // Type 2: Calculate sum with alternating signs in range [l, r]
      result = data
        .slice(l, r + 1)
        .reduce(
          (sum, value, index) => sum + (index % 2 === 0 ? value : -value),
          0
        );
    }

    results.push(result);
  }
  return results;
}

async function postOutputData(token, result) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const data = JSON.stringify(result);
    const res = await axios.post(
      "https://test-share.shub.edu.vn/api/intern-test/output",
      data,
      { headers }
    );
     
    return res.data;
  } catch (error) {
    console.error("Error posting output data:", error);
    throw error;
  }
}

async function app() {
  try {
    const inputData = await getInputData();
    const { token, data, query: queries } = inputData;
    const result = processQueries(data, queries);
    const response = await postOutputData(token, result);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

app();
