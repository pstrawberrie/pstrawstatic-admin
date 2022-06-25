const { v1: uuidv1 } = require("uuid");

const appRouter = (app, db) => {
  const dbData = db.getData("/");

  // GET DATA
  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      data: dbData,
    });
  });

  // POST DATA
  app.post("/", (req, res) => {
    console.log("POST?"); //REMOVE
    console.log(req.body);
    res.status(200);
  });
};

module.exports = appRouter;
