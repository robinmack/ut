var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var describe = require('mocha').describe;
var beforeEach = require('mocha').beforeEach;
var mockPromises = require('mock-promises');

var spy = require("sinon").spy;
var it = require('mocha').it;
var app = require('express');

describe('dbQueries', function(){
    beforeEach(function(){
        mockPromises.reset();
        
    });
    describe ('getAllUsers', function() {
        it('')
    });
});