import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  content: string;
  media?: { url: string };
}

// Fetch posts from API (Server-Side)
async function getPosts(): Promise<Post[] | { error: string }> {
  try {
    const res = await fetch("http://localhost:5000/posts", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return await res.json();
  } catch (error) {
      console.log(error);
    return { error: "Failed to load posts. Try again later."};
  }
}

export default async function Home() {
  const data = await getPosts();
  const posts = "error" in data ? [] : data;
  const error = "error" in data ? data.error : null;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="w-full max-w-4xl flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-xl font-bold">Personal Blog</h1>
        <div className="space-x-4">
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
          <Link href="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </div>
      </nav>

      {/* Posts Section */}
      <div className="w-full max-w-4xl mt-6">
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white shadow-md p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-700">{post.content}</p>

              {/* Show Media only if available */}
              {post.media?.url && (
                <img
                  src={post.media.url}
                  alt="Post media"
                  className="mt-2 rounded-lg max-w-full"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
