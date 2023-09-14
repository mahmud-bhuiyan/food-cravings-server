const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5nrgbhc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // ------------------------------
    //      chefsCollection
    // ------------------------------
    const chefsCollection = client.db("foodCravingsDB").collection("chefs");

    //get all chefs
    app.get("/chefs", async (req, res) => {
      const result = await chefsCollection.find().toArray();
      res.send(result);
    });

    //get single chef data
    app.get("/chefs/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Received ID:", id);
      const query = { _id: new ObjectId(id) };
      const result = await chefsCollection.find(query).toArray();
      res.send(result);
    });

    // ------------------------------
    //      recipesCollection
    // ------------------------------
    const recipesCollection = client.db("foodCravingsDB").collection("recipes");

    //get all recipes
    app.get("/recipes", async (req, res) => {
      const result = await recipesCollection.find().toArray();
      res.send(result);
    });

    // ------------------------------
    //      blogsCollection
    // ------------------------------
    const blogsCollection = client.db("foodCravingsDB").collection("blogs");

    //get all blogs
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged successfully connected to MongoDB!");
  } catch {
    console.log("An error occurred");
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("food-cravings!");
});

app.listen(port, () => {
  console.log(`food-cravings listening on port: ${port}`);
});
