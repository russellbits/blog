import { d as db } from "./database.js";
import { e as error } from "./index.js";
async function getPosts() {
  return await db.post.findMany({
    select: {
      createdAt: true,
      slug: true,
      title: true,
      published: true
    },
    orderBy: { createdAt: "desc" }
  });
}
async function getPublishedPosts() {
  return await db.post.findMany({
    where: { published: true },
    select: {
      createdAt: true,
      slug: true,
      title: true,
      description: true
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });
}
async function getPost(slug) {
  const post = await db.post.findUnique({
    where: { slug },
    select: {
      title: true,
      slug: true,
      description: true,
      markdown: true,
      html: true,
      published: true
    }
  });
  if (!post) {
    throw error(400, `Could not find “${slug}”`);
  }
  return post;
}
async function createPost(data) {
  await db.post.create({ data });
}
async function updatePost(slug, data) {
  return await db.post.update({
    where: { slug },
    data
  });
}
async function deletePost(slug) {
  await db.post.delete({ where: { slug } });
}
export {
  getPost as a,
  getPosts as b,
  createPost as c,
  deletePost as d,
  getPublishedPosts as g,
  updatePost as u
};
