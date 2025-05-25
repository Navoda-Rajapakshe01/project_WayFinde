"use client"
import React from "react"
import { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaEye } from "react-icons/fa"

const BlogManagement = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)

  useEffect(() => {
    // Simulate API call to fetch blog posts
    const fetchPosts = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockPosts = [
          {
            id: 1,
            title: "Top 10 Places to Visit in Sri Lanka",
            author: "John Doe",
            category: "Travel Guide",
            publishDate: "2023-06-15",
            status: "published",
            views: 1245,
          },
          {
            id: 2,
            title: "Best Time to Visit Sigiriya",
            author: "Jane Smith",
            category: "Tips",
            publishDate: "2023-06-10",
            status: "published",
            views: 980,
          },
          {
            id: 3,
            title: "Sri Lankan Cuisine: A Culinary Journey",
            author: "Robert Johnson",
            category: "Food",
            publishDate: "2023-06-05",
            status: "published",
            views: 1120,
          },
          {
            id: 4,
            title: "Wildlife Safari: Yala National Park",
            author: "Emily Davis",
            category: "Adventure",
            publishDate: "2023-05-28",
            status: "draft",
            views: 0,
          },
          {
            id: 5,
            title: "Beach Hopping in Southern Sri Lanka",
            author: "Michael Wilson",
            category: "Travel Guide",
            publishDate: "2023-05-20",
            status: "published",
            views: 850,
          },
          {
            id: 6,
            title: "Cultural Heritage of Kandy",
            author: "Sarah Brown",
            category: "Culture",
            publishDate: "2023-05-15",
            status: "published",
            views: 760,
          },
          {
            id: 7,
            title: "Hiking Trails in Ella",
            author: "David Miller",
            category: "Adventure",
            publishDate: "2023-05-10",
            status: "draft",
            views: 0,
          },
          {
            id: 8,
            title: "Tea Plantations of Nuwara Eliya",
            author: "Lisa Taylor",
            category: "Culture",
            publishDate: "2023-05-05",
            status: "published",
            views: 920,
          },
        ]

        setPosts(mockPosts)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleAddPost = () => {
    setCurrentPost(null)
    setShowAddModal(true)
  }

  const handleEditPost = (post) => {
    setCurrentPost(post)
    setShowAddModal(true)
  }

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      // In a real app, this would be an API call
      setPosts(posts.filter((post) => post.id !== postId))
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter
  const categories = [...new Set(posts.map((post) => post.category))]

  if (isLoading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading blog posts...</p>
      </div>
    )
  }

  return (
    <div className="blog-management">
      <div className="section-header">
        <h1 className="page-title">Blog Management</h1>
        <button className="add-button" onClick={handleAddPost}>
          <FaPlus /> Add New Post
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <FaFilter className="filter-icon" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Publish Date</th>
              <th>Status</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.category}</td>
                <td>{post.publishDate}</td>
                <td>
                  <span className={`status-badge ${post.status}`}>{post.status}</span>
                </td>
                <td>{post.views}</td>
                <td>
                  <div className="action-buttons">
                    <button className="view-button" title="View">
                      <FaEye />
                    </button>
                    <button className="edit-button" onClick={() => handleEditPost(post)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="delete-button" onClick={() => handleDeletePost(post.id)} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{currentPost ? "Edit Blog Post" : "Add New Blog Post"}</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form className="form">
                <div className="form-group">
                  <label htmlFor="title">Post Title</label>
                  <input
                    type="text"
                    id="title"
                    defaultValue={currentPost?.title || ""}
                    placeholder="Enter post title"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" defaultValue={currentPost?.category || ""}>
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="new">+ Add New Category</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" defaultValue={currentPost?.status || "draft"}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="content">Content</label>
                  <textarea
                    id="content"
                    rows="10"
                    defaultValue={currentPost?.content || ""}
                    placeholder="Write your blog post content here..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="featuredImage">Featured Image URL</label>
                  <input
                    type="text"
                    id="featuredImage"
                    defaultValue={currentPost?.featuredImage || ""}
                    placeholder="Enter image URL"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="save-button">Save Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogManagement
