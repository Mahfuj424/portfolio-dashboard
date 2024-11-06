"use client";
import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";

interface RoomFormProps {
  onSubmit: (data: {
    image: string | null; // Changed to use image URL
    title: string;
    description: string;
    category: string;
  }) => void;
  initialData?: {
    image: string | null; // Changed to use image URL
    title: string;
    description: string;
    category: string;
  };
}

export default function BlogForm({ onSubmit, initialData }: RoomFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.image || null
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [category, setCategory] = useState(initialData?.category || "");

  useEffect(() => {
    if (initialData?.image) {
      setImageUrl(initialData.image);
    }
  }, [initialData]);

  const handleImageRemove = () => {
    setImageFile(null);
    setImageUrl(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file)); // Set preview for newly uploaded file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let image: string | null = imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=b07b62fb5b3f5203ec96c940be5f16ba",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      image = data.data.url; // Get the image URL from the upload
    }

    onSubmit({
      image,
      title,
      description,
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-6">
      <div className="w-full md:w-1/3">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {imageUrl ? (
            <div className="relative">
              <img src={imageUrl} alt="Preview" className="max-w-full h-auto" />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 m-2"
              >
                &times; {/* Cross icon to remove image */}
              </button>
            </div>
          ) : (
            <div className="py-24">
              <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click or drag to upload an image
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
          >
            Choose File
          </label>
        </div>
      </div>
      <div className="w-full md:w-2/3 space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            placeholder="Blog Title*"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            placeholder="Blog Category*"
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            placeholder="Blog Details*"
          ></textarea>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-black border border-blue-500 p-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}
