var R = require('ramda');
var Q = require('q');

// first :: [a] -> a | Undefined
let first = R.nth(0);

// id :: Object -> String | Undefined
let id = R.prop('@id');

// defaultToEmptyString :: String -> String
let defaultToEmptyString = R.defaultTo('');

// localName :: String -> String -> String
let localName = exports.localName = R.curry(function(namespace, name){
  return R.concat(defaultToEmptyString(namespace), name);
});

// splitQName :: String -> [String]
let splitQName = R.split(':');

// qname :: Object -> String -> String
let qname = exports.qname = R.curry(function(map, name){
  return R.when(
    a => {
      return R.has(R.head(splitQName(a)), map);
    },
    a => {
      let nameParts = splitQName(a);
      return localName(R.prop(R.head(nameParts), map), R.join(':', R.tail(nameParts)));
    },
    name
  );
});

// s -> Promise [a]
let getResource = function(uri){
  return Q($.getJSON(uri))
  .then(doc => {
    return jsonld.promises.expand(doc);
  });
};

// {s: [a]} -> s -> Promise [a]
let localProperty = function(obj, p){
  return Q.fcall(function(){ return R.prop(p()); });   
};

// {'@id': u, *} -> s -> Promise [a]
let remoteProperty = function(obj, p){
  return getResource(p());
};

// Object -> s -> Promise [Object] | Undefined
let property = function(obj, property){
  // TODO: enable this resolver to be supplied via the property signature
  let defNsResolver = namespaceResolver('http://build-rest.net/vocab#');
  let p = R.when(R.complement(R.is(Function)), R.invoker(R.identity))(property);

  

  // when @id is root || @id does not exist || obj[property] exists
  //   return obj[property]

  // when @id is not root && @id does exist
  //   dereference @id and return property(dereferenced obj, property)
  let hasLocal = R.anyPass([ R.complement(R.has('@id')), R.has(p()) ]);

  return R.ifElse(hasLocal, localProperty, remoteProperty)(obj, p);

  // does the container have an @id property? if so, dereference it and look for the property
  // gate: unless @id for the supplied representation
};

    
// let bugsIndex = '/resources/index.ld-json';
// let container = $('#pipelines');

// getExpanded(bugsIndex)
// .then(function(idxDoc){
//   debugger;
//   let backlog = property(first(idxDoc), 'backlog');
// });


// let backlog = index.property(backlog)
// let bug = backlog.values[1]
// let titleProp = bug.property(title)
// let title = titleProp.first.@value
