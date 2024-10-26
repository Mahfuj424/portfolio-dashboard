/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useDeleteProjectMutation,
  useGetAllProjectQuery,
} from "@/redux/api/project";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

const AllProjects = () => {
  const { data } = useGetAllProjectQuery({});
  const projectData = data?.data;

  //   delete project

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);

  const [deletePost] = useDeleteProjectMutation();

  const handleDeletePost = (id: string) => {
    setPostIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postIdToDelete) return;

    try {
      const res = await deletePost(postIdToDelete).unwrap();
      toast.success(res?.message);
    } catch (error: any) {
      toast.error(error?.message || "Error deleting post.");
    } finally {
      setIsModalOpen(false);
      setPostIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setPostIdToDelete(null);
  };

  return (
    <div>
      <table className="min-w-full bg-white border-gray-200">
        <thead className="border-y-2">
          <tr>
            <th className="p-4 text-center font-bold text-gray-700">SL</th>
            <th className="p-4 text-center font-bold text-gray-700">Name</th>
            <th className="p-4 text-center font-bold text-gray-700">
              Category
            </th>
            <th className="p-4 text-center font-bold text-gray-700">
              Live Link
            </th>
            <th className="p-4 text-center font-bold text-gray-700">
              Server Repo
            </th>
            <th className="p-4 text-center font-bold text-gray-700">
              Client Repo
            </th>
            <th className="p-4 text-center font-bold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {projectData?.map((item: any, index: number) => (
            <tr key={item?._id} className="bg-white border-b text-center">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link
                  className="text-blue-500"
                  target="_blank"
                  href={`${item?.liveLink}`}
                >
                  Project
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link
                  className="text-blue-500"
                  target="_blank"
                  href={`${item?.serverRepo}`}
                >
                  Repo
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link
                  className="text-blue-500"
                  target="_blank"
                  href={`${item?.clientRepo}`}
                >
                  Repo
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex gap-5 justify-center">
                  <Link
                    href={`/dashboard/projects/${item?._id}`}
                    className="flex items-center text-green-500 hover:text-green-700 transition duration-300"
                  >
                    <FaRegEdit className="mr-1" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDeletePost(item?._id)}
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

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this project?
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

export default AllProjects;
