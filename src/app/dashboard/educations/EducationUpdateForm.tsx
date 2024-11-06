/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUpdateEducationMutation } from "@/redux/api/education";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface EducationUpdateFormProps {
  educationData: {
    _id: string;
    educationName: string;
    instituteName: string;
    department: string;
    description: string;
    duration: string;
    image: string;
  };
  onClose: () => void; // Function to close the update form
}

const EducationUpdateForm: React.FC<EducationUpdateFormProps> = ({
  educationData,
  onClose,
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: educationData,
  });

  const [updateEducation] = useUpdateEducationMutation();
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(educationData.image);

  // Handle image upload with imgbb
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        setLoading(true);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=b07b62fb5b3f5203ec96c940be5f16ba`,
          {
            method: "POST",
            body: formData,
          }
        );
        const imgData = await res.json();
        if (imgData.success) {
          setNewImage(imgData.data.url);
          toast.success("Image uploaded successfully!");
        } else {
          throw new Error("Failed to upload image.");
        }
      } catch (error: any) {
        toast.error("Error uploading image. Please try again.", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    const updatedData = {
      ...data,
      image: newImage,
    };

    try {
      const res = await updateEducation({
        updateData: updatedData,
        id: educationData._id,
      }).unwrap();
      toast.success(res.message || "Education updated successfully!");
      onClose(); // Close form on successful update
    } catch (error: any) {
      toast.error(error?.message || "Error updating education.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white rounded-lg shadow-md space-y-4 my-10"
    >
      <h2 className="text-xl font-semibold text-gray-800">Update Education</h2>

      <div>
        <div>
          <label className="block text-gray-600">Education Name</label>
          <input
            {...register("educationName")}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter Education Name"
          />
        </div>

        <div>
          <label className="block text-gray-600">Institute Name</label>
          <input
            {...register("instituteName")}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter Institute Name"
          />
        </div>

        <div>
          <label className="block text-gray-600">Department</label>
          <input
            {...register("department")}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter Department"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-600">Description</label>
        <textarea
          {...register("description")}
          className="w-full p-2 border rounded mt-1"
          placeholder="Enter Description"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-gray-600">Duration</label>
        <input
          {...register("duration")}
          className="w-full p-2 border rounded mt-1"
          placeholder="Enter Duration"
        />
      </div>

      <div>
        <label className="block text-gray-600">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1"
        />
        {loading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        {newImage && (
          <img src={newImage} alt="Uploaded" className="w-32 h-32 mt-2" />
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
};

export default EducationUpdateForm;
