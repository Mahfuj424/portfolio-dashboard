/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";
import {
  useDeleteEducationMutation,
  useGetAllEducationQuery,
} from "@/redux/api/education";
import EducationUpdateForm from "./EducationUpdateForm";

const AllEducationPage = () => {
  const { data } = useGetAllEducationQuery({});
  const educationData = data?.data;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<any>(null);

  const [deleteEducation] = useDeleteEducationMutation();

  const handleDeleteEducation = (id: string) => {
    setSelectedEducation(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEducation = async () => {
    if (!selectedEducation) return;

    try {
      const res = await deleteEducation(selectedEducation).unwrap();
      toast.success(res?.message || "Education deleted successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Error deleting education.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedEducation(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedEducation(null);
  };

  const openEditModal = (education: any) => {
    setSelectedEducation(education);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEducation(null);
  };

  return (
    <div className="overflow-x-auto mx-auto">
      <table className="min-w-full bg-white border-gray-200">
        <thead className="border-y-2">
          <tr>
            <th className="p-4 text-center font-bold text-gray-700">SL</th>
            <th className="p-4 text-center font-bold text-gray-700">
              Education Name
            </th>
            <th className="p-4 text-center font-bold text-gray-700">
              Department
            </th>
            <th className="p-4 text-center font-bold text-gray-700">
              Duration
            </th>
            <th className="p-4 text-center font-bold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {educationData?.map((item: any, index: number) => (
            <tr key={item?._id} className="bg-white border-b text-center">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.educationName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.duration}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex gap-5 justify-center">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
                  >
                    <FaRegEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(item?._id)}
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

      {/* Confirmation Modal for Delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this education entry?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDeleteEducation}
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

      {/* Edit Modal */}
      {isEditModalOpen && selectedEducation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-[900px]">
            <EducationUpdateForm
              educationData={selectedEducation}
              onClose={closeEditModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEducationPage;
