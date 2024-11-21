import { Application, Router } from "@oak/oak";

const app = new Application();
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.status = 201;
  ctx.response.body = `Hello world!`;
});

app.use(router.routes());

app.listen({ port: 4000 });
console.log("App listening");
