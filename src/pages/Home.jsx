import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BlogCard from '../components/BlogCard';


function Home() {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("blogs")) || [];
    setBlogs(stored);
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home">
      <SearchBar setSearchTerm={setSearchTerm} />
    
      {filteredBlogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default Home;