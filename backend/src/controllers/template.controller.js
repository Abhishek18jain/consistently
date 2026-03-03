// controllers/template.controller.js
import Template from "../models/template.model.js"
import Page from "../models/page.model.js"
import { getTemplatesByType } from "../services/template.service.js";

export async function listTemplates(req, res) {
  try {
    const { type } = req.query;
    console.log("type of controller recieved" , type)
    const templates = await getTemplatesByType(type);
    // console.log("data from service ", res.json(templates))
    console.log("templates length" , templates.length)
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function getTemplateById(req, res) {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        message: "Template not found"
      });
    }

    res.json(template);

  } catch (err) {
    console.error("Get template error:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
}
export const createFromTemplate = async (req, res) => {
  const { journalId, templateId } = req.params;

  const template = await Template.findById(templateId);
  if (!template) return res.status(404).json({ error: "Template not found" });

  const today = new Date().toISOString().slice(0, 10);

  const page = await Page.create({
    journalId,
    date: today,
    templateId: template._id,
    blocks: template.blocks,
    createdFromTemplate: true
  });

  res.json(page);
};