
class Layer {

  constructor(path, fn) {

    this.handle = fn;
    this.name = fn.name || '<anonymous>';
    this.path = undefined;

    // mimic path-to-regexp for amqp events - https://github.com/pillarjs/path-to-regexp
    this.regexp = new RegExp('^' + path + '$', 'gi');

    // allow matching all
    if(path === '')
      this.regexp.matchAll = true;
  }

  match(path) {
    if (path == null) {
      this.path = undefined;
      return false;
    }

    if (this.regexp.matchAll) {
      this.path = path;
      return true;
    }

    let m = this.regexp.exec(path);
    if (!m) {
      this.path = undefined;
      return false;
    }

    this.path = m[0];
    return true;
  }

  async handleEvent(msg, next) {
    return this.handle(msg, next);
  }
}

let app = {
  stack: [],

  async on(path, fn) {
    let layer = new Layer(path, fn);
    this.stack.push(layer);
  },

  async use(path, fn) {
    let layer;

    if(typeof(path) === 'function')
      layer = new Layer('', path);
    else
      layer = new Layer(path, fn);

    this.stack.push(layer);
  },

  async dispatch(path, msg) {
    let stack = this.stack;
    let idx = 0;

    const next = async () => {
      let layer;
      let match;

      // find next matching layer
      while (!match && idx < stack.length) {
        layer = stack[idx];
        match = layer.match(path);
        idx += 1;

        if(!match)
          continue;
      }

      // no match found
      if(!match) {
        return;
      }

      // otherwise... process
      const result = await layer.handleEvent(msg, next);
      if(result)
        console.log(result);
    };
    await next();
  }
}

app.use(async (msg, next) => {
  console.log('general logging start');
  await next();
  console.log('general logging end');
});

app.use('test', async (msg, next) => {
  console.log('test logging start' );
  await next();
  console.log('test logging end');
});

app.on('tester', async(msg, next) => {
  console.log('tester');
  await next();
});

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


app
  .dispatch('test', { name: 'hello' })
  .catch(err => console.log(err.stack));



async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}