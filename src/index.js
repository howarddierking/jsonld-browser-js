// s -> Promise [a]
let getResource = function(uri){
  return Q($.getJSON(uri))
  .then(doc => {
    return jsonld.promises.expand(doc);
  });
};

// first :: [a] -> a | Undefined
let first = R.nth(0);

// id :: Object -> String | Undefined
let id = R.prop('@id');



// s -> s -> s
let localNameResolver = R.curry(function(namespace, localName){
  return function(){ return R.concat(namespace, localName )};
});

// {s} -> s -> s
let qnameResolver = R.curry(function(map){
  // TODO
  return undefined;
});



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