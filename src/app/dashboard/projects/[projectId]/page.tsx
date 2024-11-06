/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useGetSingleProjectQuery,
  useUpdateProjectMutation,
} from "@/redux/api/project";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTimes } from "react-icons/fa";

// Define the type for project data
interface ProjectData {
  name: string;
  description: string;
  image: string;
  category: string;
  features: string[];
  technologyStack: string[];
  liveLink: string;
  serverRepo: string;
  clientRepo: string;
}

// Define the type for params
interface Params {
  projectId: string; // Adjust the type based on your expected parameter type
}

interface ProjectForm {
  name: string;
  description: string;
  image: string;
  category: string;
  features: string[];
  technologyStack: string[];
  liveLink: string;
  serverRepo: string;
  clientRepo: string;
}

const EditProject = ({ params }: { params: Promise<Params> }) => {
  const router = useRouter();
  const [updateProject] = useUpdateProjectMutation();
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Unwrap the params using Promise
    params.then(({ projectId }) => {
      setProjectId(projectId);
    });
  }, [params]);

  const { data } = useGetSingleProjectQuery(projectId as string);
  const editProjectData = data?.data as ProjectData; // Type assertion

  // Initialize state for form fields
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    image: "",
    category: "",
    features: [],
    technologyStack: [],
    liveLink: "",
    serverRepo: "",
    clientRepo: "",
  });

  const [newFeature, setNewFeature] = useState<string>("");
  const [newTech, setNewTech] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Set default values when data is fetched
    if (editProjectData) {
      setForm({
        name: editProjectData.name,
        description: editProjectData.description,
        image: editProjectData.image,
        category: editProjectData.category,
        features: editProjectData.features,
        technologyStack: editProjectData.technologyStack,
        liveLink: editProjectData.liveLink,
        serverRepo: editProjectData.serverRepo,
        clientRepo: editProjectData.clientRepo,
      });
      setImageUrl(editProjectData.image);
    }
  }, [editProjectData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageUrl(reader.result as string);
          setForm((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setForm((prev) => ({ ...prev, image: "" }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm((prev) => ({
        ...prev,
        features: [...prev.features, newFeature],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTech = () => {
    if (newTech.trim()) {
      setForm((prev) => ({
        ...prev,
        technologyStack: [...prev.technologyStack, newTech],
      }));
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    setForm((prev) => ({
      ...prev,
      technologyStack: prev.technologyStack.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateProject({ updateData: form, projectId }).unwrap();
      console.log("Project created successfully:", res);
      toast.success(res.message);
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Project</h1>
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
              <>
                <img
                  src={imageUrl}
                  alt="Project preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="ml-3 text-red-600 hover:text-red-800"
                >
                  Remove Image
                </button>
              </>
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
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(index)}
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
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
          <input
            type="url"
            id="liveLink"
            name="liveLink"
            value={form.liveLink}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="serverRepo"
            className="block text-sm font-medium text-gray-700"
          >
            Server Repository
          </label>
          <input
            type="url"
            id="serverRepo"
            name="serverRepo"
            value={form.serverRepo}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="clientRepo"
            className="block text-sm font-medium text-gray-700"
          >
            Client Repository
          </label>
          <input
            type="url"
            id="clientRepo"
            name="clientRepo"
            value={form.clientRepo}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </form>

      
    </div>
  );
};

export default EditProject;
