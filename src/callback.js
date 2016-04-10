/**
 * This demonstrates the middleware pattern using Node-style callback passing
 */

function App() {
  this.handlers = [];
}

module.exports = App;

App.prototype.init = function init() {
  this.handlers = [];
}

App.prototype.handle = function handle(handler) {
  this.handlers.push(handler);
}

App.prototype.run = function run(input) {
  console.log('\nRunning example %s', input);

  // create a copy of the handlers array so
  // that the values can be shifted off the array
  // in a resursive manner
  let handlers = this.handlers.slice();
  let done, chain;

  // create a completion function that will
  // check to see if the middleware handler
  // returned a result... if there is any
  // result, we are finished... otherwise
  // we continue down the chain
  done = (err, result) => {
    if(!err && !result)
      chain(handlers.shift());
    else
      console.log(' done with value %s', err || result);
  }

  // create a callback chaning pattern lambda and
  // supply the done function as our "next" function
  // to execute
  chain = (fn) => {
    if(fn) fn(input, done);
  }

  // start the chain with the first element on the stack
  chain(handlers.shift());
}
