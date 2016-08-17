var idx  = require('../src/index');
var should = require('should');

describe('index', ()=>{
  describe('#localName', ()=>{
    it('should return the qualified name when given a base name and a local name', ()=>{
      idx.localName('http://foo.com/', 'bar').should.eql('http://foo.com/bar');
    });
    it('should curry properly', ()=>{
      idx.localName('http://foo.com/')('bar').should.eql('http://foo.com/bar');
    });
    it('should return the local name when the base name is not provided', ()=>{
      idx.localName(undefined, 'bar').should.eql('bar');
    });
  });

  describe('#qname', ()=>{
    it('should return the qualified name when given a map and a local name', ()=>{
      let qnames = {
        a: 'http://foo.com/',
        b: 'http://bar.com/'
      };

      idx.qname(qnames, 'a:alpha').should.eql('http://foo.com/alpha');
      idx.qname(qnames, 'b:bravo').should.eql('http://bar.com/bravo');
    });
    it('should return the local name when the q value cannot be found in the map', ()=>{
      idx.qname({}, 'a:alpha').should.eql('a:alpha');
    });
  });
});
