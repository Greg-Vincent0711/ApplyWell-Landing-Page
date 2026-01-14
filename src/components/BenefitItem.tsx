export default function BenefitItem({
    icon,
    title,
    description
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return <div className="flex flex-col items-center text-center group">
        <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-gray-200 transition-all duration-300 shadow-sm">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm md:text-base">
          {description}
        </p>
      </div>;
  }