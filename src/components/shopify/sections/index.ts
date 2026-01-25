import { Header } from "./header";
import { Footer } from "./footer";
import { MainBlog } from "./MainBlog";
import { MainBlogPost } from "./MainBlogPost";
import { FooterUtilities } from "./FooterUtilities";

export const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "header": Header,
  "footer": Footer,
  "main-blog": MainBlog,
  "main-blog-post": MainBlogPost,
  "footer-utilities": FooterUtilities,
};
