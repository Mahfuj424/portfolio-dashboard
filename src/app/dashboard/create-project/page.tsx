"use client";
import { useCreateProjectMutation } from "@/redux/api/project";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTimes, FaLink, FaServer, FaDesktop } from "react-icons/fa";

type Feature = string;
type TechStack = string;

interface ProjectForm {
  name: string;
  features: Feature[];
  description: string;
  image: File | null;
  category: string;
  technologyStack: TechStack[];
  liveLink: string;
  serverRepo: string;
  clientRepo: string;
}

export default function PortfolioProjectForm() {
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    features: [],
    description: "",
    image: null,
    category: "",
    technologyStack: [],
    liveLink: "",
    serverRepo: "",
    clientRepo: "",
  });
  const [newFeature, setNewFeature] = useState("");
  const [newTech, setNewTech] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file)); // Set preview for newly uploaded file
    }
  };

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setForm({ ...form, features: [...form.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updatedFeatures });
  };

  const addTech = () => {
    if (newTech.trim() !== "") {
      setForm({
        ...form,
        technologyStack: [...form.technologyStack, newTech.trim()],
      });
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    const updatedTechStack = form.technologyStack.filter((_, i) => i !== index);
    setForm({ ...form, technologyStack: updatedTechStack });
  };

  const [createProject] = useCreateProjectMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let image: string | null = imageUrl;

    // Upload image if a new file has been selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=b07b62fb5b3f5203ec96c940be5f16ba",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        image = data.data.url; // Get the image URL from the upload
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image.");
        return;
      }
    }

    // Submit the form data, including the uploaded image URL
    try {
      const res = await createProject({ ...form, image }).unwrap();
      console.log("Project created successfully:", res);
      toast.success(res.message);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
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
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Project Image
          </label>
          <div className="mt-1 flex items-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Project preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select a category</option>
            <option value="all">All</option>
            <option value="booking">Booking</option>
            <option value="e-learning">E-Learning</option>
            <option value="e-commerce">E-Commerce</option>
            <option value="javascript">Javascript</option>
            <option value="landing-page">Landing Page</option>
            <option value="portfolio">Portfolio</option>
            <option value="service">Service</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Features
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add a feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Technology Stack
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add a technology"
            />
            <button
              type="button"
              onClick={addTech}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.technologyStack.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(index)}
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none focus:bg-green-500 focus:text-white"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="liveLink"
            className="block text-sm font-medium text-gray-700"
          >
            Live Link
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <FaLink className="h-5 w-5" />
            </span>
            <input
              type="url"
              id="liveLink"
              name="liveLink"
              value={form.liveLink}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="serverRepo"
            className="block text-sm font-medium text-gray-700"
          >
            Server Repository
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <FaServer className="h-5 w-5" />
            </span>
            <input
              type="url"
              id="serverRepo"
              name="serverRepo"
              value={form.serverRepo}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://github.com/example/server-repo"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="clientRepo"
            className="block text-sm font-medium text-gray-700"
          >
            Client Repository
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <FaDesktop className="h-5 w-5" />
            </span>
            <input
              type="url"
              id="clientRepo"
              name="clientRepo"
              value={form.clientRepo}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://github.com/example/client-repo"
            />
          </div>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
}
