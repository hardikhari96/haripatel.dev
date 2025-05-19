import { useState } from 'react';

interface CategoryFilterProps {
  projects: Array<{
    category: string;
    [key: string]: any;
  }>;
}

const CategoryFilter = ({ projects }: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(projects.map(project => project.category))];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="mb-8">
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
