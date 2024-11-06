"use client";
import React, { useState } from "react";
import axios from "axios";
import { FaUpload, FaCode } from "react-icons/fa";
import { useCreateTechSkillsMutation } from "@/redux/api/skills";
import toast from "react-hot-toast";

interface SkillForm {
  name: string;
  image: string;
}

export default function SkillForm() {
  const [form, setForm] = useState<SkillForm>({
    name: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          params: {
            key: "b07b62fb5b3f5203ec96c940be5f16ba", // Replace with your actual imgbb API key
          },
        }
      );
      setForm({ ...form, image: response.data.data.url });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const [createTechSkill]= useCreateTechSkillsMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      await uploadImage();
    }
    // Handle form submission here
    try {
      const res = await createTechSkill(form).unwrap();
      console.log("Project created successfully:", res);
      toast.success(res.message);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Skill</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Skill Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCode className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g., React"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Skill Icon or Image
          </label>
          <div className="mt-1 flex items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Skill preview"
                className="w-24 h-24 object-cover rounded-md"
              />
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            <label
              htmlFor="image-upload"
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              <span>Upload image</span>
              <input
                id="image-upload"
                name="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <FaUpload className="animate-spin h-5 w-5 mr-3" />
                Uploading...
              </>
            ) : (
              "Add Skill"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
