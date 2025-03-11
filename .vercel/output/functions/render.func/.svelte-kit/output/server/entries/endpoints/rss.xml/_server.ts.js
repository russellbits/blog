import RSS from "rss";
import { g as getPublishedPosts } from "../../../chunks/posts.js";
const GET = async ({ url }) => {
  const allPosts = await getPublishedPosts();
  const siteUrl = url.origin;
  const feed = new RSS({
    title: `Title`,
    description: "Description",
    site_url: `${siteUrl}`,
    feed_url: `${siteUrl}/rss.xml`
  });
  allPosts.forEach(
    (post) => feed.item({
      title: post.title,
      description: post.description,
      url: `${siteUrl}/${post.slug}`,
      date: post.createdAt
    })
  );
  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml"
    }
  });
};
export {
  GET
};
