const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.response.body = 'Server response';

  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT');
  ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, x-requested-with');
  
  if (ctx.request.method === 'OPTIONS') {
    ctx.response.status = 204;
    return;
  } else {
    await next();

    return;
  }
});

router.get('/posts/latest', async (ctx) => {
  console.log('Request received at /posts/latest');
  const randomCount = Math.floor(Math.random() * (11 - 1) + 1);
  const response = getRandomPosts(randomCount);
  ctx.body = response;
});

router.get('/posts/:postId/comments/latest', async (ctx) => {
  const { postId } = ctx.params;
  console.log(`Request received at /posts/${postId}/comments/latest`);
  let randomCount = Math.floor(Math.random() * 4);
  const response = getRandomComments(randomCount, postId);
  ctx.body = response;
});

function generatePost() {
  return {
    id: faker.string.uuid(),
    author_id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    author: faker.person.fullName(),
    avatar: faker.image.avatar(),
    img: faker.image.url(),
    created: Math.floor(Date.now() / 1000),
  };
}

function generateComment(postId) {
  return {
    id: faker.string.uuid(),
    post_id: postId,
    author_id: faker.string.uuid(),
    author: faker.person.fullName(),
    avatar: faker.image.avatar(),
    content: generateRealisticText(),
    created: Math.floor(Date.now() / 1000),
  };
}

function generateRealisticText() {
  const sentences = [];
  sentences.push(faker.hacker.phrase());
  sentences.push(faker.company.buzzPhrase());
  return sentences.join(' ');
}

function getRandomPosts(count) {
  const posts = [];
  for (let i = 0; i < count; i++) {
    posts.unshift(generatePost());
  }

  return {
    status: "ok",
    data: posts,
  }
}

function getRandomComments(count, postId) {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.unshift(generateComment(postId));
  }

  return {
    status: "ok",
    data: comments,
  }
}

app.use(router.routes());
app.use(router.allowedMethods());

const port = 9080;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Server is listening to ' + port);
})