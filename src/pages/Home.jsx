import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("blogs") || "[]");
      setBlogs(stored);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      setBlogs([]);
    }
  }, []);

  const handleDelete = (id) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home">
      <SearchBar setSearchTerm={setSearchTerm} />
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
        ))
      ) : (
        <div className="blogdirect">
          <Link to="create">CREATE NEW BLOG</Link>
        </div>
      )}
    </div>
  );
}

export default Home;
