import { request } from "./apiClient";

/**
 * WRITE — บันทึก feedback ใหม่
 */
export async function createFeedback(payload) {
  return request("/api/feedbacks/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
