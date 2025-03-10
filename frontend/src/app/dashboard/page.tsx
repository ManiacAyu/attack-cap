"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [postAddedReload, setPostAddedReload] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);

    axios
      .get("http://localhost:5000/posts/:id", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again.");
        setLoading(false);
      });
  }, [router, postAddedReload]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setMedia(event.target.files[0]);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;
    const formData = new FormData();
    formData.append("content", newPost);
    if (media) formData.append("media", media);
    console.log(formData.get("content"));
    try {
      const res = await axios.post("http://localhost:5000/post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNewPost("");
      setMedia(null);
      setPostAddedReload(!postAddedReload);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post.");
    }
  };
  console.log(posts);
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

  
      <div className="w-full flex flex-col items-center flex-grow">
        <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md mt-6">
          <textarea
            placeholder="What's happening?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring focus:ring-blue-300"
          ></textarea>


          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaUpload}
            className="mt-3 block w-full text-gray-600"
          />

          <button
            onClick={handlePostSubmit}
            className="mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Post
          </button>
        </div>

 
        <div className="w-full mt-6 flex flex-col items-center">
          {loading ? (
            <p className="text-gray-600">Loading posts...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="w-full max-w-3xl bg-white p-6 shadow rounded-lg mb-4">
                <h2 className="font-bold text-gray-900">{post.title}</h2>
                <p className="text-gray-900">{post.content}</p>
                {post?.media?.url!=null && (
                  <img
                    src={post.media}
                    alt="media"
                    className="w-full mt-2 rounded-md object-cover"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
