import TemplateCard from "./TemplateCard";

export default function TemplateGrid({ templates, onSelect }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-8
      "
    >
      {templates.map((t) => (
        <TemplateCard
          key={t._id}
          template={t}
          onClick={() => onSelect(t._id)}
        />
      ))}
    </div>
  );
}