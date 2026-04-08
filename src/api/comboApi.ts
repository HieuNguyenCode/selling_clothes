import axiosInstance from '../utils/Axios.Config';

const handleResponse = (res: any) => {
  if (res.data.status === 200 || res.data.status === 201) return res.data;
  throw new Error(res.data.message || 'Lỗi hệ thống');
};

export const comboApi = {
  getCombos: (search = '', page = 1, pageSize = 10) => 
    axiosInstance.get(`/api/v1/Combo`, { params: { search, page, pageSize } }).then(handleResponse),

  getComboById: (id: string) => 
    axiosInstance.get(`/api/v1/Combo/${id}`).then(handleResponse),

  saveCombo: (id: string | null, formData: FormData) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return id 
      ? axiosInstance.put(`/api/v1/Combo/${id}`, formData, config).then(handleResponse)
      : axiosInstance.post(`/api/v1/Combo`, formData, config).then(handleResponse);
  },

  deleteCombo: (id: string) => 
    axiosInstance.delete(`/api/v1/Combo/${id}`).then(handleResponse),

  togglePublish: (id: string) =>
    axiosInstance.patch(`/api/v1/Combo/${id}/Publish`).then(handleResponse)
};
