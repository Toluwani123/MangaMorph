import api from "@/api";

export const chaptersApi = {
  list(ordering = "-created_at") {
    return api.get(`/chapters/?ordering=${encodeURIComponent(ordering)}`).then(r => r.data);
  },

  retrieve(id) {
    return api.get(`/chapters/${id}/`).then(r => r.data);
  },


};