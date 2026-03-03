// services/template.service.js

import Template from "../models/template.model.js";

export async function getTemplatesByType(type) {
 return Template.find({ type });
}