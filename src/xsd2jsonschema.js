#!/usr/bin/env node
var request = require('request');
var byline = require('byline');
var fs = require('fs');
var xml2js = require('xml2js');
var xpath = require("xml2js-xpath");

function processFromFile(filepath) {
  fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    processXML(data);
  });
}

// processFromFile('test/fixtures/simplefo.xsd');
processFromFile('xsd2jsonschema/test/fixtures/in.xsd');
//Read the first match only!
function processXML(xml) {
  xml2js.parseString(xml, function(err, json) {
    var element = xpath.find(json, "//schema/element");
    if (typeof element != null) {
      var jsonObj = {};
      jsonObj["title"] =xpath.evalFirst(json, "//schema/element","name");
      jsonObj["type"] = typeof element;

      if (typeof xpath.find(json, "//sequence") != null) {
        var seqname = xpath.evalFirst(json, "//sequence/element","name");
        var properties = {};
        properties[seqname] = {};
        properties[seqname]["type"] = xpath.evalFirst(json, "//sequence/element","type");
        jsonObj["properties"] = properties;
      }
    }
  });
}

// var xpath = require('xpath');
// var dom = require('xmldom').DOMParser;

// function processXML(xml) {

//   console.log(xml);
//   var doc = new dom().parseFromString(xml);
//   var name = xpath.select1("//sequence/element/@name", doc).value;

//   console.log("name:" + name);

// }
