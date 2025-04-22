import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function BlogCard({ blog, onDelete }) {
  if (!blog || !blog.content) return null; // safe guard

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [blog.content]);

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
      onDelete(blog.id); // notify parent instantly
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
