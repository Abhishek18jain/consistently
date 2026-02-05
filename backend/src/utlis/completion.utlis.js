export const calculateCompletion = (templateType, content) => {
  if (!content) return 0;

  switch (templateType) {
    case "todo":
    case "grocery": {
      const items = content.items || [];
      if (!items.length) return 0;

      const completed = items.filter((i) => i.done).length;
      return Math.round((completed / items.length) * 100);
    }

    case "study":
    case "planning": {
      const blocks = content.blocks || [];
      if (!blocks.length) return 0;

      const completed = blocks.filter((b) => b.completed).length;
      return Math.round((completed / blocks.length) * 100);
    }

    case "reflection":
      return 0;

    default:
      return 0;
  }
};
