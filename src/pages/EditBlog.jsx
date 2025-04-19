import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditBlog() {
  const { id } = useParams(); // Get the blog ID from the URL
  const navigate = useNavigate(); // Navigate function to redirect the user

  // Set initial state
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    // Get the blogs from localStorage
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const blog = blogs.find(b => b.id === parseInt(id));

    if (blog) {
      // Set the form values to the existing blog's data
      setTitle(blog.title);
      setImage(blog.image);  // Set the image if it exists
      setContent(blog.content);
    }
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the new image (Base64 string)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const updatedBlog = { 
      id: parseInt(id), 
      title, 
      content,
      image // Updated image if changed
    };

    const updatedBlogs = blogs.map(blog =>
      blog.id === parseInt(id) ? updatedBlog : blog
    );

    // Save the updated blogs back to localStorage
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

    // Navigate back to home page ("/")
    navigate("/"); // Redirect to the home page
  };

  return (
    <div className="page-2">
      <form onSubmit={handleSubmit}>
        <div className="two">
          <input
            placeholder="Title"
            value={title}
            className="title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Only show file input if there is no image */}
          {!image && (
            <div>
              <input
                id="file-upload"
                type="file"
                className="image-upload"
                onChange={handleImageUpload}
              />
            </div>
          )}

          {/* Show the image preview if an image is set */}
          {image && (
            <div className="image-preview-container">
              <img
                src={image}
                alt="Preview"
                className="image-preview"
              />
              {/* Optionally, allow the user to remove the image */}
              <button 
                type="button" 
                onClick={() => setImage(null)} 
                className="rm-img-btn"
              >
                Remove Image
              </button>
            </div>
          )}

          <textarea
            placeholder="Content"
            value={content}
            className="content"
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button className="submit" type="submit">
          Update Blog
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
