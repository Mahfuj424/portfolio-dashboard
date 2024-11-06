"use client";
import React, { useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import { useCreateEducationMutation } from "@/redux/api/education";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EducationForm {
  educationName: string;
  instituteName: string;
  department: string;
  description: string;
  duration: string;
  image: string;
}

export default function EducationForm() {
  const router = useRouter();
  const [form, setForm] = useState<EducationForm>({
    educationName: "",
    instituteName: "",
    department: "",
    description: "",
    duration: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const [createEducation] = useCreateEducationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      await uploadImage();
    }
    // Handle form submission here
    try {
      const res = await createEducation(form).unwrap();
      console.log("Project created successfully:", res);
      toast.success(res.message);
      router.push("/dashboard/eductions");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Education</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="educationName"
            className="block text-sm font-medium text-gray-700"
          >
            Education Name
          </label>
          <input
            type="text"
            id="educationName"
            name="educationName"
            value={form.educationName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="instituteName"
            className="block text-sm font-medium text-gray-700"
          >
            Institute Name
          </label>
          <input
            type="text"
            id="instituteName"
            name="instituteName"
            value={form.instituteName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={form.department}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Duration
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={form.duration}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., 2015 - 2019"
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <div className="mt-1 flex items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Education preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
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
              "Add Education"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
