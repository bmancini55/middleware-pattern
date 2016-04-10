
const app = {

  handlers: {},

  async on(event, handler) {
    if(!this.handlers[event])
      this.handlers[event] = [];

    this.handlers[event].push(handler);
  },

  async exec(path, msg) {
    const handlers = this.handlers[path].slice();
    const run = async () => {
      const handler = handlers.splice(0,1)[0];
      const result = await handler(msg, run);
      if(result)
        console.log(result);
    };
    run();
  }
};



app.on('test', async (msg, next) => {
  console.log('test 1 start');
  await wait(1000);
  await next();
  console.log('test 1 end');
});

app.on('test', async (msg, next) => {
  console.log('test 2 start');
  await wait(1000);
  await next();
  console.log('test 2 end');
});

app.on('test', async (msg) => {
  console.log('test 3 start');
  await wait(1000);
  return msg.name + ' world';
});

app.exec('test', { name: 'hello' });


async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}