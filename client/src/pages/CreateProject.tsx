import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, X, Loader, Upload } from 'lucide-react';
import axios from 'axios';

const skillOptions = [
  'HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python',
  'PHP', 'WordPress', 'Laravel', 'UI/UX Design', 'Graphic Design', 'Content Writing',
  'SEO', 'Digital Marketing', 'Mobile Development', 'Data Analysis', 'Java', 'Spring boot'
];

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skills: [] as string[],
    "budget": {
      "min": '',
      "max": ''
    },
    deadline: '',
    attachments: [] as File[],
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'budgetMin' || name === 'budgetMax') {
      setFormData({
        ...formData,
        budget: {
          ...formData.budget,
          [name === 'budgetMin' ? 'min' : 'max']: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillInput(value);
    
    if (value.trim()) {
      const filtered = skillOptions.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !formData.skills.includes(skill)
      );
      setFilteredSkills(filtered);
      setShowSkillDropdown(true);
    } else {
      setFilteredSkills([]);
      setShowSkillDropdown(false);
    }
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill) && formData.skills.length < 10) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput('');
    setFilteredSkills([]);
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...fileList].slice(0, 5) // Limit to 5 files
      });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...formData.attachments];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, attachments: updatedFiles });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await axios.post('/api/projects', formData, {withCredentials: true})
    .then((res) => {
      if(res.data.success) console.log("Project posted successfully");
      else console.log("Failed to post project.")
    })
    .catch(err => console.log(err))
    .finally(() => {
        setIsSubmitting(false);
        navigate('/dashboard', { state: { projectPosted: true } });
    })
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Post a New Project</h1>
        <p className="text-gray-600">
          Fill in the details below to post your project and find the perfect freelancer.
        </p>
      </div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label htmlFor="title" className="label">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input"
              placeholder="e.g., Website Redesign for E-commerce Store"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="label">
              Project Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="input"
              placeholder="Describe your project in detail. Include requirements, goals, and any specific skills needed."
              required
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input"
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label htmlFor="skills" className="label">
              Skills Required
            </label>
            <div className="relative">
              <input
                type="text"
                id="skills"
                value={skillInput}
                onChange={handleSkillInputChange}
                className="input"
                placeholder="Start typing to add skills..."
                disabled={formData.skills.length >= 10}
              />
              
              {showSkillDropdown && filteredSkills.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredSkills.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-primary-500 hover:text-primary-700 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              {formData.skills.length}/10 skills selected
            </p>
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budgetMin" className="label">
                Minimum Budget ($)
              </label>
              <input
                type="number"
                id="budgetMin"
                name="budgetMin"
                value={formData.budget.min}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., 500"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="budgetMax" className="label">
                Maximum Budget ($)
              </label>
              <input
                type="number"
                id="budgetMax"
                name="budgetMax"
                value={formData.budget.max}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., 1000"
                min={formData.budget.min || "1"}
                required
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="label">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="input"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="label">
              Attachments (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Upload size={30} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5 files, 10MB each)
              </p>
              <input
                type="file"
                id="attachments"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="attachments"
                className="btn btn-outline cursor-pointer"
              >
                Browse Files
              </label>
            </div>

            {/* File List */}
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Uploaded Files:</p>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader size={20} className="animate-spin mr-2" />
                  Posting Project...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <PlusCircle size={20} className="mr-2" />
                  Post Project
                </span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProject;