const { v1: uuidv1 } = require("uuid");

const appRouter = (app, db) => {
  // GET DATA
  app.get("/", (req, res) => {
    const category = req.query?.category;
    const id = req.query?.id;

    if(category) {
      // get by category
      try {
        const isAll = category === 'all';
        const dbResult = db.getData(isAll ? '/' : `/${category}`);
        const dbResultCount = isAll ? null : db.count(`/${category}`);
        return res.json({
          count: dbResultCount,
          result: dbResult,
        });
      } catch(err) {
        return res.status(500).send(`500: error getting category "${category}" from db. Error response: ${JSON.stringify(err)}`);
      }
    }
    
    // get by id
    if(id) {
      try {
        const allData = db.getData('/');
        const keys = Object.keys(allData);
        const resultMap = keys.reduce((result, key) => {
          const idx = db.getIndex(`/${key}`, id);
          if(idx > -1) result.push(`/${key}[${idx}]`);
          return result;
        }, []);
        
        if(resultMap.length > 0) {
          const dbItem = db.getData(resultMap[0]);
          if(dbItem) return res.json({ result: dbItem });
        }

        return res.status(404).send(`item with id "${id}" not found`);
      } catch(err) {
        return res.status(500).send(`500: error getting item by id "${id}" from db. Error response: ${JSON.stringify(err)}`);
      }
    }

    // error: no valid query provided
    return res.status(500).send(`500: no valid query provided. received query: ${JSON.stringify(req.query)}`);
  });

  // POST DATA
  app.post("/", (req, res) => {
    console.log("POST?"); //REMOVE
    console.log(req.body);
    res.status(200).send('200: success');
  });

  // TESTING
  app.get("/test", (req, res) => {
    const test = db.getIndex('/music', '02');
    res.json({
      result: test
    });
  });
};

module.exports = appRouter;
