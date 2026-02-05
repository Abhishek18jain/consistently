import { updatePageContent } from "../services/updatepage.service.js";

export const updatePage = async (req, res) => {
  try {
    const page = await updatePageContent(
      req.user._id,
      req.params.pageId,
      req.body.content
    );

    res.json({
      pageId: page._id,
      completionPercent: page.completionPercent,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
