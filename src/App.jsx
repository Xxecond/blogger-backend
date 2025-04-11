import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateBlog from "./pages/CreateBlog";
import About from "./pages/About";
import BlogDetails from "./pages/BlogDetails"; // Make sure to import your BlogDetails component
import Header from './components/Header';
import EditBlog from './pages/EditBlog';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
function App() {
  return (
    <BrowserRouter basename="/blogger">
      <Navbar />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<CreateBlog />} />
        <Route path='/about' element= {<><About />
         <Footer />
         </>} />
        <Route path='/blog/:id' element={<BlogDetails />} /> {/* Add this route */}
        <Route path='/edit/:id' element ={<EditBlog />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
