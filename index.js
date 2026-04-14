import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

const startSercer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startSercer();
const nameTest = "Mary";
const genderizeApi = async (name) => {
  try {
    const response = await axios.get(`https://api.genderize.io?name=${name}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

//genderizeApi();
app.get("/api/classify", async (request, response) => {
  const { name } = request.query;
  try {
    const data = await genderizeApi(name);
    const { gender, probability, count } = data;
    const sample_size = count;
    if (!data) {
      return response
        .status(400)
        .send({ status: "error", message: "Missing or Empty name" });
    } else if (typeof name !== "string") {
      return response
        .status(422)
        .send({ status: "error", message: "Unprocessable entity" });
    } else if ((gender === null) | (count === 0)) {
      return response.send({
        status: "error",
        message: "No prediction available for the provided name",
      });
    }
    const extractedData = {
      status: "success",
      data: {
        name,
        gender,
        probability,
        sample_size,
        is_confident: probability >= 0.7 && sample_size >= 100 ? true : false,
        processed_at: new Date().toISOString(),
      },
    };
    console.log(extractedData);
    return response.json(extractedData).status(200);
  } catch (error) {
    console.log(error);
  }
});
