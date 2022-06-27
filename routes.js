const { v1: uuidv1 } = require("uuid");
const { getDbPathFromId } = require("./util");

const appRouter = (app, db) => {
  // GET DATA
  app.get("/", (req, res) => {
    const category = req.query?.category;
    const id = req.query?.id;

    // get by category
    if(category) {
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
        const idPath = getDbPathFromId(db, id);
        if(idPath) {
          const dbItem = db.getData(idPath);
          if(dbItem) return res.json({ result: dbItem });
        }
        return res.status(404).send(`404: item with id "${id}" not found in db`);
      } catch(err) {
        return res.status(500).send(`500: error getting item by id "${id}". Error: ${err}`);
      }
    }

    // error: no valid query provided
    return res.status(500).send(`500: no valid query provided. received query: ${JSON.stringify(req.query)}`);
  });

  // POST DATA
  app.post("/", (req, res) => {
    const id = req.query?.id;
    const add = req.query?.add;

    // Post by ID
    if(id && typeof req.body === 'object' && req.body.id) {
      try {
        const idPath = getDbPathFromId(db, id);
        if(idPath) {
          db.push(idPath, req.body);
          return res.status(200).send(`200: db post successful for id "${id}"`);
        }
        return res.status(404).send(`404: item with id "${id}" not found in db`);
      } catch(err) {
        return res.status(500).send(`500: error getting item by id "${id}". Error: ${err}`);
      }
    }
    
    // Post new item into a category
    if(add && typeof req.body === 'object') {
      const { category } = req.body;
      if(category) {
        const newItem = {id: uuidv1(), ...req.body};
        delete newItem['category'];
        db.push(`/${category}[]`, newItem);
        return res.status(200).send(`200: db post successful for add new item with new id "${newItem.id}"`);
      } else {
        return res.status(500).send(`500: did not recieve category in the JSON post for add new item.`);
      }
    }

    return res.status(500).send(`500: no valid query provided. received query: ${JSON.stringify(req.query)}`);
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
