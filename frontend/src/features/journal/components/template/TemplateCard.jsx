export default function TemplateCard({ template, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group cursor-pointer
        rounded-2xl overflow-hidden
        bg-zinc-900 border border-zinc-800
        hover:border-indigo-500/50
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1
      "
    >
      {/* 🖼️ Preview */}
      <div className="relative h-44 overflow-hidden">

        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="
              w-full h-full object-cover
              transition duration-500
              group-hover:scale-110
            "
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-zinc-800 text-zinc-500">
            No Preview
          </div>
        )}

        {/* 🌌 Gradient overlay */}
        <div className="
          absolute inset-0
          bg-gradient-to-t
          from-black/70
          via-black/20
          to-transparent
        " />

        {/* ⭐ CTA on hover */}
        <div className="
          absolute inset-0
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition
        ">
          <button className="
            bg-indigo-500 hover:bg-indigo-600
            text-white text-sm font-medium
            px-4 py-2 rounded-lg
            shadow-lg
          ">
            Use Template
          </button>
        </div>
      </div>

      {/* 🧠 Content */}
      <div className="p-4 space-y-3">

        {/* Name + type */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            {template.name}
          </h3>

          <p className="text-xs text-indigo-400 uppercase tracking-wide">
            {template.journalType}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 line-clamp-2">
          {template.description}
        </p>

        {/* Tags */}
        {template.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="
                  text-xs px-2 py-1
                  bg-zinc-800 text-zinc-300
                  rounded-md
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Sections count */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-zinc-500">
            {template.blocks?.length || 0} sections
          </span>

          <span className="
            text-xs bg-indigo-500/20
            text-indigo-400 px-2 py-1
            rounded-md
          ">
            Template
          </span>
        </div>
      </div>
    </div>
  );
}