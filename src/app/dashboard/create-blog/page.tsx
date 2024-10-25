"use client";
import BlogForm from "@/component/blog/BlogForm";
import { useCreateBlogMutation } from "@/redux/api/blog"; // Ensure this path is correct
import React from "react";
import toast from "react-hot-toast";

const CreateBlogPage = () => {
  const [createBlog] = useCreateBlogMutation();

  const handleCreate = async (data: {
    image: string | null; // Change this to imageUrl
    title: string;
    description: string;
    category: string;
  }) => {
    try {
      const res = await createBlog(data).unwrap(); // Ensure unwrap is called
      console.log("Blog created successfully:", res);
      toast.success(res.message);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog."); // Optionally notify the user
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Blog</h1>
      <BlogForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateBlogPage;
