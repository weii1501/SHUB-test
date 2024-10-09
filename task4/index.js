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

class SumQueryProcessor {
  process(data, range) {
    const [l, r] = range;
    return data.slice(l, r + 1).reduce((sum, value) => sum + value, 0);
  }
}

class AlternatingSumQueryProcessor {
  process(data, range) {
    const [l, r] = range;
    return data
      .slice(l, r + 1)
      .reduce(
        (sum, value, index) => sum + (index % 2 === 0 ? value : -value),
        0
      );
  }
}

class QueryProcessorFactory {
  createQueryProcessor(type) {
    switch (type) {
      case "1":
        return new SumQueryProcessor();
      case "2":
        return new AlternatingSumQueryProcessor();
      default:
        throw new Error("Invalid query type");
    }
  }
}

function processQueries(data, queries) {
  const results = [];
  const factory = new QueryProcessorFactory();

  for (const query of queries) {
    const { type, range } = query;
    const processor = factory.createQueryProcessor(type);
    const result = processor.process(data, range);
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
    console.log("Result:", result);
    const response = await postOutputData(token, result);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

app();
