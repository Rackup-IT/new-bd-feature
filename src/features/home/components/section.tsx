import { DBResponseSchema } from "../../admin-panel/validation/blog/db_response";
import HightlightPost from "./highlighted_post";
import NonHighlightPost from "./nonhighlighted_post";

interface SectionProps {
  useHightlightedPost: boolean;
  posts: DBResponseSchema[];
}

const Section: React.FC<SectionProps> = (props) => {
  return (
    <section className="grid grid-cols-3 gap-4 sm:grid-cols-12 sm:gap-6 sm:gap-y-2 xl:gap-x-8 xl:gap-y-4 mb-4">
      {props.posts.map((post, index) => {
        if (!post) {
          return null;
        }
        if (props.useHightlightedPost && index === 0) {
          return <HightlightPost key={post._id} post={post} />;
        } else {
          return <NonHighlightPost key={post._id} post={post} />;
        }
      })}
    </section>
  );
};

export default Section;
