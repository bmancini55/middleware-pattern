
let app = require('./callback')();

app.handle((input, next) => {
  console.log(' handler 1 entered with input %s', input);
  if(input === '1') {
    next(null, '1');
  } else {
    next();
  }
  console.log(' handler 1 exited with input %s', input);
});

app.handle((input, next) => {
  console.log(' handler 2 entered with input %s', input);
  if(input === '2') {
    next(null, '2');
  } else {
    next();
  }
  console.log(' handler 2 exited with input %s', input);
});

app.handle((input, next) => {
  console.log(' handler 3 entered with input %s', input);
  if(input === '3') {
    next(null, '3');
  } else {
    next();
  }
  console.log(' handler 3 exited with input %s', input);
});


app.run('1');
app.run('2');
app.run('3');
