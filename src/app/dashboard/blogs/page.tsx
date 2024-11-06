/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  useDeleteBlogMutation,
  useGetAllBlogQuery,
  useUpdateBlogMutation,
} from "@/redux/api/blog";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import BlogForm from "@/component/blog/BlogForm";
import toast from "react-hot-toast";

const AllBlogPage = () => {
  const { data } = useGetAllBlogQuery({});
  const blogData = data?.data;

  // Modal visibility and selected blog data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  // Define the update hook
  const [updateBlog] = useUpdateBlogMutation();

  // Open modal with selected blog data for editing
  const handleEditClick = (blog: any) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);

  const [deleteBlog] = useDeleteBlogMutation();

  const handleDeleteBlog = (id: string) => {
    setPostIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postIdToDelete) return;

    try {
      const res = await deleteBlog(postIdToDelete).unwrap();
      toast.success(res?.message);
    } catch (error: any) {
      toast.error(error?.message || "Error deleting post.");
    } finally {
      setIsDeleteModalOpen(false);
      setPostIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPostIdToDelete(null);
  };

  return (
    <div className="overflow-x-auto mx-auto">
      <table className="min-w-full bg-white border-gray-200">
        <thead className="border-y-2">
          <tr>
            <th className="p-4 text-center font-bold text-gray-700">SL</th>
            <th className="p-4 text-center font-bold text-gray-700">Title</th>
            <th className="p-4 text-center font-bold text-gray-700">Views</th>
            <th className="p-4 text-center font-bold text-gray-700">Likes</th>
            <th className="p-4 text-center font-bold text-gray-700">
              Comments
            </th>
            <th className="p-4 text-center font-bold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {blogData?.map((item: any, index: number) => (
            <tr key={item?._id} className="bg-white border-b text-center">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.views?.length}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.likes?.length}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.comments?.length}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex gap-5 justify-center">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
                  >
                    <FaRegEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(item?._id)}
                    className="flex items-center text-red-500 hover:text-red-700 transition duration-300"
                  >
                    <RiDeleteBinLine className="mr-1" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for BlogForm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/2">
            <h2 className="text-center text-xl font-bold mb-4">
              {selectedBlog ? "Edit Blog" : "Add Blog"}
            </h2>
            <BlogForm
              onSubmit={async (formData) => {
                console.log("Form data being submitted:", formData); // Log form data
                try {
                  await updateBlog({
                    updateData: formData,
                    blogId: selectedBlog?._id, // Pass blogId correctly
                  }).unwrap();
                  closeModal(); // Close modal on successful update
                } catch (error) {
                  console.error("Update failed:", error);
                }
              }}
              initialData={selectedBlog || undefined}
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times; {/* Close icon */}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this blog?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDeletePost}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogPage;
