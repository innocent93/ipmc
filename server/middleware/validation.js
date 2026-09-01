const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message).join(', ');
    return res.status(400).json({ success: false, message: messages });
  }
  next();
};

exports.schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'editor', 'viewer').optional(),
  }),
  blogPost: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    slug: Joi.string().min(3).max(200).required(),
    excerpt: Joi.string().max(300).required(),
    content: Joi.string().min(10).required(),
    coverImage: Joi.string().uri().required(),
    author: Joi.object({
      name: Joi.string().required(),
      avatar: Joi.string().uri().allow('').optional(),
      role: Joi.string().allow('').optional(),
    }).required(),
    category: Joi.string().valid('esg', 'financial', 'project-management', 'environmental', 'industry-news', 'insights').required(),
    tags: Joi.array().items(Joi.string()).optional(),
    readTime: Joi.number().optional(),
    isPublished: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    metaTitle: Joi.string().allow('').optional(),
    metaDescription: Joi.string().allow('').optional(),
  }),
  service: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    slug: Joi.string().min(3).max(200).required(),
    shortDescription: Joi.string().max(200).required(),
    fullDescription: Joi.string().min(10).required(),
    icon: Joi.string().allow('').optional(),
    image: Joi.string().uri().allow('').optional(),
    features: Joi.array().items(Joi.string()).optional(),
    benefits: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().valid('project-management', 'financial', 'environmental', 'esg', 'assurance', 'fraud').required(),
    isActive: Joi.boolean().optional(),
    order: Joi.number().optional(),
    metaTitle: Joi.string().allow('').optional(),
    metaDescription: Joi.string().allow('').optional(),
  }),
  teamMember: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().required(),
    title: Joi.string().required(),
    bio: Joi.string().min(10).required(),
    image: Joi.string().uri().required(),
    email: Joi.string().email().allow('').optional(),
    linkedin: Joi.string().uri().allow('').optional(),
    twitter: Joi.string().uri().allow('').optional(),
    isActive: Joi.boolean().optional(),
    order: Joi.number().optional(),
    department: Joi.string().valid('leadership', 'engineering', 'consulting', 'environmental', 'finance').optional(),
  }),
  contact: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('').optional(),
    company: Joi.string().allow('').optional(),
    subject: Joi.string().min(3).max(200).required(),
    message: Joi.string().min(10).max(5000).required(),
    serviceInterest: Joi.string().allow('').optional(),
  }),
  newsletter: Joi.object({
    email: Joi.string().email().required(),
  }),
  partner: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    logo: Joi.string().uri().required(),
    website: Joi.string().uri().allow('').optional(),
    description: Joi.string().allow('').optional(),
    category: Joi.string().valid('regulatory', 'industry', 'international', 'academic').optional(),
    isActive: Joi.boolean().optional(),
    order: Joi.number().optional(),
  }),
  esgReport: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    type: Joi.string().valid('report', 'rating', 'news', 'insight').required(),
    description: Joi.string().required(),
    content: Joi.string().min(10).required(),
    coverImage: Joi.string().uri().allow('').optional(),
    documentUrl: Joi.string().uri().allow('').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isPublished: Joi.boolean().optional(),
  }),
  job: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    slug: Joi.string().min(3).max(200).required(),
    department: Joi.string().required(),
    location: Joi.string().required(),
    type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').optional(),
    description: Joi.string().min(10).required(),
    requirements: Joi.array().items(Joi.string()).optional(),
    responsibilities: Joi.array().items(Joi.string()).optional(),
    benefits: Joi.array().items(Joi.string()).optional(),
    salaryRange: Joi.string().allow('').optional(),
    experienceLevel: Joi.string().allow('').optional(),
    isActive: Joi.boolean().optional(),
    closingDate: Joi.date().optional(),
  }),
  settings: Joi.object({
    key: Joi.string().required(),
    value: Joi.required(),
    group: Joi.string().valid('general', 'seo', 'social', 'contact', 'appearance').optional(),
  }),
};

exports.validate = validate;
