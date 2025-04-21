import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/layout/Header'
import Home from "./pages/Home"
import About from "./pages/About"
import Articles from "./pages/Articles"
import Events from "./pages/Events"
import Gallery from "./pages/Gallery"
import AdminArticlePost from './pages/admin/Article/AdminArticleForm'
import { Route, Routes,  } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import ArticleDetail from './pages/ArticleDetail'
import AdminEventPost from './pages/admin/Events/AdminEventForm'
import EventDetail from "./pages/EventDetail"
import AdminGalleryPost from './pages/admin/Gallery/AdminGalleryForm'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLayout from './components/layout/AdminLayout'
import AdminArticleList from './pages/admin/Article/AdminArticleList'
import AdminEventList from './pages/admin/Events/AdminEventList'
import AdminGalleryList from './pages/admin/Gallery/AdminGalleryList'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (
    <>
      {/* <Header /> */}
      {/*Routes*/}
      <Routes>
        <Route path='/go-admin/login' element={<AdminLogin />} />
        <Route element={<PublicLayout />}> // This is the layout that wraps all the pages
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About /> } />
          <Route path='/articles' element={<Articles />} />
          <Route path='/events' element={<Events />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/articles/:slug' element={<ArticleDetail />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Route>
        {/* Admin Dashboard Routes*/ }
        <Route
          path='/go-admin/*'
          element = {
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path='dashboard' element={<AdminDashboard />} />
                  <Route path='articles/new' element={<AdminArticlePost />} />
                  <Route path='articles' element={<AdminArticleList />} />
                  <Route path='articles/edit/:id' element={<AdminArticlePost />} />
                  <Route path='events/new' element={<AdminEventPost />} />
                  <Route path='events' element={<AdminEventList />} />
                  <Route path='events/edit/:id' element={<AdminEventPost />} />
                  <Route path='gallery/new' element={<AdminGalleryPost />} />
                  <Route path='gallery' element={<AdminGalleryList />} />
                  <Route path='gallery/edit/:id' element={<AdminGalleryPost />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </>
  )
}

export default App
