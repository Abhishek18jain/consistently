export default function TemplateCard({ template, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group cursor-pointer rounded-2xl overflow-hidden
        bg-white border border-gray-200
        hover:border-blue-300 hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* Preview */}
      <div className="relative h-44 overflow-hidden">
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-500
                       group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br
                          from-gray-50 to-gray-100 text-gray-400">
            <span className="text-3xl">📄</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* CTA on hover */}
        <div className="absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium
                             px-4 py-2 rounded-lg shadow-lg transition-all active:scale-95">
            Use Template
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {template.name}
          </h3>
          <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">
            {template.journalType}
          </p>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">
          {template.description}
        </p>

        {template.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500
                           rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-1">
          <span className="text-xs text-gray-400">
            {template.blocks?.length || 0} sections
          </span>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5
                           rounded-md font-medium">
            Template
          </span>
        </div>
      </div>
    </div>
  );
}