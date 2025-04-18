import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function BlogCard({ blog }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentRef.current) {
      // Check if content is overflowing (scrollHeight > clientHeight)
      const element = contentRef.current;
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [blog.content]); // Re-check when content changes

  const handleToggle = () => {
    if (isOverflowing) {
      setIsExpanded(prev => !prev);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete this blog?")) {
      const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      const updatedBlogs = blogs.filter(b => b.id !== blog.id);
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      navigate(0);
    }
  };

  return (
    <div className="blog-card">
      <h2>{blog.title}</h2>

      {blog.image && (
        <div className="image-container">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="blog-image"
          />
        </div>
      )}

      <div 
        ref={contentRef}
        className={`blog-content ${isExpanded ? 'expanded' : ''}`} 
        onClick={handleToggle}
        style={{ cursor: isOverflowing ? 'pointer' : 'default' }}
      >
        <p>{blog.content}</p>
        {isOverflowing && !isExpanded && (
          <span className="view-more">... View more</span>
        )}
        {isOverflowing && isExpanded && (
          <span className="view-less">View less</span>
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