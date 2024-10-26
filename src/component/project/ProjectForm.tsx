// ProjectForm.tsx
'use client'
import React, { useState } from "react";

interface ProjectFormProps {
  onSubmit: (formData: ProjectFormData) => void;
}

interface ProjectFormData {
  technologyStack: string[];
  features: string[];
  liveLink: string;
  serverRepo: string;
  clientRepo: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<ProjectFormData>({
    technologyStack: [],
    features: [],
    liveLink: "",
    serverRepo: "",
    clientRepo: "",
  });

  const [newTech, setNewTech] = useState<string>("");
  const [newFeature, setNewFeature] = useState<string>("");

  const addTech = () => {
    if (newTech.trim()) {
      setForm((prev) => ({
        ...prev,
        technologyStack: [...prev.technologyStack, newTech],
      }));
      setNewTech("");
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form); // Pass the form data back to the parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Technology Stack:</label>
        <input
          type="text"
          value={newTech}
          onChange={(e) => setNewTech(e.target.value)}
          placeholder="Add a technology"
        />
        <button type="button" onClick={addTech}>
          Add Tech
        </button>
        <ul>
          {form.technologyStack.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </div>

      <div>
        <label>Features:</label>
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a feature"
        />
        <button type="button" onClick={addFeature}>
          Add Feature
        </button>
        <ul>
          {form.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      <div>
        <label>Live Link:</label>
        <input
          type="url"
          value={form.liveLink}
          onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
        />
      </div>

      <div>
        <label>Server Repo:</label>
        <input
          type="url"
          value={form.serverRepo}
          onChange={(e) => setForm({ ...form, serverRepo: e.target.value })}
        />
      </div>

      <div>
        <label>Client Repo:</label>
        <input
          type="url"
          value={form.clientRepo}
          onChange={(e) => setForm({ ...form, clientRepo: e.target.value })}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ProjectForm;
