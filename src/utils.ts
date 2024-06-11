export function getCategorizedIds(data) {
  let result = {
    division: [],
    district: [],
    upazila: [],
    thana: [],
    ward: [],
  };

  function traverse(level, type) {
    if (Array.isArray(level)) {
      for (let item of level) {
        if ("id" in item) {
          result[type].push(item["id"]);
        }
        traverse(item, type);
      }
    } else if (typeof level === "object" && level !== null) {
      for (let key in level) {
        traverse(level[key], key);
      }
    }
  }

  traverse(data, "");
  for (let key in result) {
    result[key] = result[key].join(",");
  }

  return result;
}
