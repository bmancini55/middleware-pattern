
let App = require('./promise');
let app = new App();

app.handle(async (input, next) => {
  console.log(' handler 1 entered with input %s', input);
  await slow();
  if(input === '1') {
    await next('1');
  } else {
    await next();
  }
  console.log(' handler 1 exited with input %s', input);
});

app.handle(async (input, next) => {
  console.log(' handler 2 entered with input %s', input);
  await slow();
  if(input === '2') {
    await next('2');
  } else {
    await next();
  }
  console.log(' handler 2 exited with input %s', input);
});

app.handle(async (input, next) => {
  console.log(' handler 3 entered with input %s', input);
  await slow();
  if(input === '3') {
    await next('3');
  } else {
    await next();
  }
  console.log(' handler 3 exited with input %s', input);
});


async function run() {
  await app.run('1');
  await app.run('2');
  await app.run('3');
}

run().catch(console.log);

async function slow() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });
}