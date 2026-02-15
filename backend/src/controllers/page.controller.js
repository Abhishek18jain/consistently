import {
  createOrUpdatePage,
  getPageByDate
} from "../services/page.service.js";
export async function savePage(req, res, next) {
  try {
    const userId = req.user.userId;   // string from JWT

    console.log("Controller userId:", userId);
    const page = await createOrUpdatePage(userId, req.body);
    

    res.status(200).json(page);
  } catch (err) {
    next(err);
  }
}


/**
 * GET /pages/:bookId/:date
 * Fetch page for a specific date
 */
export async function fetchPage(req, res, next) {
  try {
    const { bookId, date } = req.params;
    const userId = req.user.userId;

    const page = await getPageByDate(
      userId,
      bookId,
      new Date(date)
    );

    res.status(200).json(page);
  } catch (err) {
    next(err);
  }
}
