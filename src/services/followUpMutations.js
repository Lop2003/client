import { request } from "./apiClient";

/**
 * WRITE — บันทึก follow-up ใหม่
 */
export async function createFollowUp(payload) {
  return request("/api/follow-ups/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * WRITE — อัปเดตสถานะ follow-up
 */
export async function updateFollowUpStatus(id, status) {
  return request(`/api/follow-ups/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
