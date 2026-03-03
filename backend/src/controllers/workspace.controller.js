import { getWorkspaceStatus } from "../services/workspace.service.js";

export async function workspaceStatus(req, res, next) {
  try {
    const userId = req.user.userId;

    const status = await getWorkspaceStatus(userId);

    res.status(200).json(status);
  } catch (err) {
    next(err);
  }
}