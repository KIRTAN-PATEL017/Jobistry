import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Upload, X, Loader, DollarSign, Calendar } from 'lucide-react';

// Mock project data
const mockProject = {
  id: '1',
  title: 'E-commerce Website Redesign and Development',
  clientName: 'John Doe',
  budget: {
    min: 2500,
    max: 3500,
  },
};

const SubmitProposal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    bidAmount: mockProject.budget.min.toString(),
    estimatedDays: '14',
    attachments: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...fileList].slice(0, 3) // Limit to 3 files
      });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...formData.attachments];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, attachments: updatedFiles });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard', { state: { proposalSubmitted: true } });
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/projects/${id}`} className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          &larr; Back to Project
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Submit a Proposal</h1>
        <p className="text-gray-600 mb-1">
          Project: <span className="font-medium">{mockProject.title}</span>
        </p>
        <p className="text-gray-600">
          Client: <span className="font-medium">{mockProject.clientName}</span>
        </p>
      </div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="label">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={8}
              className="input"
              placeholder="Introduce yourself and explain why you're the best fit for this project. Highlight relevant experience and approach to the work."
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-2">
              Be specific and personalized. Generic proposals are less likely to succeed.
            </p>
          </div>

          {/* Bid Amount */}
          <div>
            <label htmlFor="bidAmount" className="label">
              Your Bid Amount ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="bidAmount"
                name="bidAmount"
                value={formData.bidAmount}
                onChange={handleInputChange}
                className="input pl-10"
                min={Math.floor(mockProject.budget.min * 0.8)}
                max={Math.ceil(mockProject.budget.max * 1.2)}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Project budget: ${mockProject.budget.min.toLocaleString()} - ${mockProject.budget.max.toLocaleString()}
            </p>
          </div>

          {/* Estimated Completion Time */}
          <div>
            <label htmlFor="estimatedDays" className="label">
              Estimated Completion (days)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="estimatedDays"
                name="estimatedDays"
                value={formData.estimatedDays}
                onChange={handleInputChange}
                className="input pl-10"
                min="1"
                max="365"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="label">
              Attachments (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Upload size={30} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Attach portfolio samples or documents that showcase your relevant work
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 3 files, 5MB each)
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
                  Submitting Proposal...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Send size={20} className="mr-2" />
                  Submit Proposal
                </span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SubmitProposal;