import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function BlogCard({ blog }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Determine if the content is longer than the 4 lines limit (set by character length here)
  const isLongText = blog.content.length > 200; // Adjust this value as needed

  const handleDelete = () => {
    const confirm = window.confirm("Delete this blog?");
    if (confirm) {
      let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      blogs = blogs.filter(b => b.id !== blog.id);
      localStorage.setItem("blogs", JSON.stringify(blogs));
      navigate(0); // Reload the page to reflect changes
    } 
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded); // Toggle the content display
  };

  // Display only a truncated version of content if not expanded
  const displayedContent = isExpanded ? blog.content : blog.content.slice(0, 200);

  return (
    <div className="blog-card">
      <h2>{blog.title}</h2>
      
      {/* Image container with fixed dimensions */}
      <div className="image-container">
        {blog.image && (
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="blog-image"
          />
        )}
      </div>

      <div className="blog-content">
        <p>{displayedContent}</p>

        {/* Show "View More" button only if the content is longer than the limit */}
        {isLongText && (
          <button onClick={handleToggle}>
            {isExpanded ? "View Less" : "View More"}
          </button>
        )}
      </div>

      <div className="blog-actions">
        <Link to={`/edit/${blog.id}`}>Edit</Link> |{" "}
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default BlogCard;
