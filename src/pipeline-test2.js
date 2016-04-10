
const app = {

  handlers: {},

  on(event, handler) {
    if(!this.handlers[event])
      this.handlers[event] = [];

    this.handlers[event].push(handler);
  },

  exec(path, msg) {
    const handlers = this.handlers[path].slice();
    const run = () => {
      const handler = handlers.splice(0,1)[0];
      const result = handler(msg, run);
      if(result)
        console.log(result);
    };
    run();
  }
};



app.on('test', (msg, next) => {
  console.log('test 1 start');
  next();
  console.log('test 1 end');
});

app.on('test', (msg, next) => {
  console.log('test 2 start');
  next();
  console.log('test 2 end');
});

app.on('test', (msg) => {
  console.log('test 3 start');
  return msg.name + ' world';
});

app.exec('test', { name: 'hello' });