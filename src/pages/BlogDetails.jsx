
import { useParams } from 'react-router-dom';

function BlogDetails() {
  const { id } = useParams();
  const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
  const blog = blogs.find(b => b.id === parseInt(id));

  if (!blog) return <p>Blog not found</p>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
    </div>
  );
}
export default BlogDetails;