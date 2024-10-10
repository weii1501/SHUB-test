const axios = require("axios");

const SUM_QUERY = "1";
const ALTERNATING_SUM_QUERY = "2";

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

    if (type === SUM_QUERY) {
      let sum1 = 0;
      let left = l;
      let right = r;

      while (left <= right) {
        if (left !== right) {
          sum1 += data[left] + data[right];
        } else if (left === right) {
          sum1 += data[left];
        }

        left++;
        right--;
      }
      results.push(sum1);
    } else if (type === ALTERNATING_SUM_QUERY) {
      let sum = 0;
      let left = l;
      let right = r;
      let indexLeft = 0;
      let indexRight = r-l;

      while (left <= right) {
        if (left !== right) {
          if (indexLeft % 2 === 0) {
            sum += data[left];
          } else {
            sum -= data[left];
          }

          if (indexRight % 2 === 0) {
            sum += data[right];
          } else {
            sum -= data[right];
          }
        } else if (left === right) {
          if (indexLeft % 2 === 0) {
            sum += data[left];
          } else {
            sum -= data[left];
          }
        }

        left++;
        indexLeft++;
        right--;
        indexRight--;
      }
      results.push(sum);
    }
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

