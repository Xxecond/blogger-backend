import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // This will be the Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const newBlog = { 
      id: Date.now(), 
      title, 
      content,
      image // This is now a Base64 string
    };
    blogs.push(newBlog);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    navigate('/');
  };

  return (
    <div className="page-2">
      <form onSubmit={handleSubmit}>
        <div className='two'> 
          <input 
            placeholder="Title" 
            value={title} 
            className='title' 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
          
          <input 
            type='file' 
            className='image-upload'
            onChange={handleImageUpload}
            required 
          />
          
          {image && (
            <img 
              src={image}
              alt="Preview" 
              className="image-preview"
            />
          )}
          
          <textarea 
            placeholder="Content" 
            value={content} 
            className='content' 
            onChange={e => setContent(e.target.value)} 
            required 
          />
        </div>
        <button className='submit' type="submit">Add</button>
      </form>
    </div>
  );
}

export default CreateBlog;