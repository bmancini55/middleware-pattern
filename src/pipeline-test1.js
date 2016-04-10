
const app = {

  handlers: {},

  get(path, handler) {
    if(!this.handlers[path])
      this.handlers[path] = [];

    this.handlers[path].push(handler);
  },

  exec(path) {
    let req = {};
    let res = {};
    res.end = () => {
      res.complete = true;
    };

    let handlers = this.handlers[path].slice();
    let run = () => {
      if(!res.complete) {
        let handler = handlers.splice(0,1)[0];
        handler(req, res, run);
      }
    };
    run();
  }
};



app.get('test', (req, res, next) => {
  console.log('test 1 start');
  next();
  console.log('test 1 end');
});

app.get('test', (req, res, next) => {
  console.log('test 2 start');
  next();
  console.log('test 2 end');
});

app.get('test', (req, res) => {
  console.log('test 3 start');
  res.end();
});

app.exec('test');