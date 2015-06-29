require("whatwg-fetch");
var Promise = require("rsvp").Promise;

function makePath(obj, path) {
  var segments = path.split("/").filter(function(s) {
    return s.length;
  });
  function mk(obj, path) {
    var n;
    if (path.length === 0) {
      return obj;
    }
    if (!obj.hasOwnProperty(path[0])) {
      n = {};
      obj[path[0]] = n;
    } else {
      n = obj[path[0]];
    }
    return mk(n, path.slice(1));
  }
  return mk(obj, segments);
}

function objToQuery(obj) {
  return Object.keys(obj).map(function(key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
  }).join("&");
}

function makeMethod(url, schema, path, method) {
  var endpoint = url + path;
  return function(args) {
    var query = args ? objToQuery(args) : "";
    var url = endpoint + (query.length ? "?" + query : "");
    return window.fetch(url, {
      method: method,
      mode: "cors"
    }).then(function(res) {
      return res.json();
    });
  };
}

function getSchema(url) {
  return window.fetch(url + "/api-docs").then(function(res) {
    return res.json();
  });
}

function makeAPI(url, schema) {
  var api = {};
  Object.keys(schema.paths).forEach(function(path) {
    var target = makePath(api, path);
    const methods = schema.paths[path];
    Object.keys(methods).forEach(function(method) {
      const spec = methods[method];
      target[spec.operationId] = makeMethod(url, schema, path, method);
    });
  });
  return api;
}

function connect(url) {
  return getSchema(url).then(function(schema) {
    return makeAPI(url, schema);
  });
}

module.exports = connect;
