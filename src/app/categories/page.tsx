import CategoriesCard from "@/components/Categories/CategoriesCard";

const CategoriesPage = () => {
  const categories = [
    {
      id: 1,
      name: "Weight Loss",
      description:
        "Effective weight management solutions including GLP-1 medications",
      productCount: 8,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: 2,
      name: "Peptides",
      description: "Advanced peptide therapies for recovery and performance",
      productCount: 12,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: 3,
      name: "Wellness",
      description: "Comprehensive wellness and longevity support",
      productCount: 15,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      id: 4,
      name: "Hormone Therapy",
      description: "Hormone optimization and replacement therapy",
      productCount: 6,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      id: 5,
      name: "Immune Support",
      description: "Boost your immune system with targeted treatments",
      productCount: 9,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      id: 6,
      name: "Cognitive Enhancement",
      description: "Mental clarity and cognitive performance optimization",
      productCount: 7,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ];

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold theme-text-primary mb-2">
            Treatment Categories
          </h1>
          <p className="theme-text-muted">
            Choose a category to explore our specialized treatments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <CategoriesCard key={category?.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
