import sanitizeHtml from "sanitize-html";

const sanitizeConf = {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
    allowedAttributes: { a: ["href"] }
};

// Get around sanitize-html typing issues
export function sanitizeHtmlContent(state) {
   return sanitizeHtml(state, sanitizeConf);
}
