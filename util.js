/**
 * Get DB Path From ID
 */
exports.getDbPathFromId = (db, id) => {
  try {
    const allData = db.getData('/');
    const keys = Object.keys(allData);
    const resultMap = keys.reduce((result, key) => {
      const idx = db.getIndex(`/${key}`, id);
      if (idx > -1) result.push(`/${key}[${idx}]`);
      return result;
    }, []);
    if(resultMap.length > 0) return resultMap[0];
    return null;
  } catch(err) {
    return new Error(err);
  }
};
