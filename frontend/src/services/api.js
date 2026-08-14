const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ──────────────────────────────────────────────────────────────
   Core HTTP helpers
────────────────────────────────────────────────────────────── */

/**
 * Shared fetch wrapper — forwards cookies on every request.
 * Throws { status, message } on non-2xx so thunks can rejectWithValue().
 */
async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw { status: res.status, message: data?.message || "Something went wrong." };
    }

    return data;
}

const get    = (path)         => request(path);
const post   = (path, body)   => request(path, { method: "POST",   body: JSON.stringify(body) });
const patch  = (path, body)   => request(path, { method: "PATCH",  body: JSON.stringify(body) });
const put    = (path, body)   => request(path, { method: "PUT",    body: JSON.stringify(body) });
const del    = (path)         => request(path, { method: "DELETE" });

/* ──────────────────────────────────────────────────────────────
   Auth API  (/api/admin/auth)
────────────────────────────────────────────────────────────── */
export const authApi = {
    loginOfficeUser:  (email, password) => post("/api/admin/auth/login", { email, password }),
    logoutOfficeUser: ()               => post("/api/admin/auth/logout"),
    getAdminProfile:  ()               => get("/api/admin/auth/me"),
};

/* ──────────────────────────────────────────────────────────────
   Customers  (/api/customers)
────────────────────────────────────────────────────────────── */
export const customerApi = {
    create:           (data)     => post("/api/customers", data),
    getAll:           (query="") => get(`/api/customers${query ? `?${query}` : ""}`),
    getById:          (id)       => get(`/api/customers/${id}`),
    update:           (id, data) => patch(`/api/customers/${id}`, data),
    delete:           (id)       => del(`/api/customers/${id}`),
    findOrCreate:     (data)     => post("/api/customers/find-or-create", data),
    verifyOtp:        (id, data) => patch(`/api/customers/${id}/verify-otp`, data),
};

/* ──────────────────────────────────────────────────────────────
   Enquiries  (/api/enquiries)
────────────────────────────────────────────────────────────── */
export const enquiryApi = {
    create:    (data)     => post("/api/enquiries", data),
    getAll:    (query="") => get(`/api/enquiries${query ? `?${query}` : ""}`),
    getById:   (id)       => get(`/api/enquiries/${id}`),
    update:    (id, data) => patch(`/api/enquiries/${id}`, data),
    addNote:   (id, data) => post(`/api/enquiries/${id}/notes`, data),
    delete:    (id)       => del(`/api/enquiries/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Work Orders  (/api/work-orders)
────────────────────────────────────────────────────────────── */
export const workOrderApi = {
    create:        (data)     => post("/api/work-orders", data),
    getAll:        (query="") => get(`/api/work-orders${query ? `?${query}` : ""}`),
    getById:       (id)       => get(`/api/work-orders/${id}`),
    updateStatus:  (id, data) => patch(`/api/work-orders/${id}/status`, data),
    assignPartner: (id, data) => patch(`/api/work-orders/${id}/assign`, data),
    addNote:       (id, data) => post(`/api/work-orders/${id}/notes`, data),
    delete:        (id)       => del(`/api/work-orders/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Estimates  (/api/estimates)
────────────────────────────────────────────────────────────── */
export const estimateApi = {
    create:         (data)     => post("/api/estimates", data),
    getAll:         (query="") => get(`/api/estimates${query ? `?${query}` : ""}`),
    getById:        (id)       => get(`/api/estimates/${id}`),
    update:         (id, data) => patch(`/api/estimates/${id}`, data),
    updateApproval: (id, data) => patch(`/api/estimates/${id}/approval`, data),
    delete:         (id)       => del(`/api/estimates/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Invoices  (/api/invoices)
────────────────────────────────────────────────────────────── */
export const invoiceApi = {
    create:              (data)     => post("/api/invoices", data),
    getAll:              (query="") => get(`/api/invoices${query ? `?${query}` : ""}`),
    getById:             (id)       => get(`/api/invoices/${id}`),
    update:              (id, data) => patch(`/api/invoices/${id}`, data),
    updatePaymentStatus: (id, data) => patch(`/api/invoices/${id}/payment-status`, data),
    markWhatsAppSent:    (id, data) => patch(`/api/invoices/${id}/whatsapp-sent`, data),
    delete:              (id)       => del(`/api/invoices/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Payments  (/api/payments)
────────────────────────────────────────────────────────────── */
export const paymentApi = {
    create:  (data)     => post("/api/payments", data),
    getAll:  (query="") => get(`/api/payments${query ? `?${query}` : ""}`),
    update:  (id, data) => patch(`/api/payments/${id}`, data),
    verify:  (id, data) => patch(`/api/payments/${id}/verify`, data),
    delete:  (id)       => del(`/api/payments/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Categories  (/api/categories)
────────────────────────────────────────────────────────────── */
export const categoryApi = {
    create:  (data)     => post("/api/categories", data),
    getAll:  (query="") => get(`/api/categories${query ? `?${query}` : ""}`),
    getById: (id)       => get(`/api/categories/${id}`),
    update:  (id, data) => patch(`/api/categories/${id}`, data),
    delete:  (id)       => del(`/api/categories/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Services  (/api/services)
────────────────────────────────────────────────────────────── */
export const serviceApi = {
    create:  (data)     => post("/api/services", data),
    getAll:  (query="") => get(`/api/services${query ? `?${query}` : ""}`),
    getById: (id)       => get(`/api/services/${id}`),
    update:  (id, data) => patch(`/api/services/${id}`, data),
    toggle:  (id)       => patch(`/api/services/${id}/toggle`, {}),
    delete:  (id)       => del(`/api/services/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Service Partners  (/api/service-partners)
────────────────────────────────────────────────────────────── */
export const partnerApi = {
    create:  (data)     => post("/api/service-partners", data),
    getAll:  (query="") => get(`/api/service-partners${query ? `?${query}` : ""}`),
    getById: (id)       => get(`/api/service-partners/${id}`),
    update:  (id, data) => patch(`/api/service-partners/${id}`, data),
    toggle:  (id)       => patch(`/api/service-partners/${id}/toggle`, {}),
    delete:  (id)       => del(`/api/service-partners/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Employees  (/api/employees)
────────────────────────────────────────────────────────────── */
export const employeeApi = {
    create:            (data)     => post("/api/employees", data),
    getAll:            (query="") => get(`/api/employees${query ? `?${query}` : ""}`),
    getById:           (id)       => get(`/api/employees/${id}`),
    update:            (id, data) => patch(`/api/employees/${id}`, data),
    updatePermissions: (id, data) => patch(`/api/employees/${id}/permissions`, data),
    delete:            (id)       => del(`/api/employees/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Conversations  (/api/conversations)
────────────────────────────────────────────────────────────── */
export const conversationApi = {
    create:          (data)     => post("/api/conversations", data),
    getAll:          (query="") => get(`/api/conversations${query ? `?${query}` : ""}`),
    getById:         (id)       => get(`/api/conversations/${id}`),
    addMessage:      (id, data) => post(`/api/conversations/${id}/messages`, data),
    linkCustomer:    (id, data) => post(`/api/conversations/${id}/link-customer`, data),
    updateStatus:    (id, data) => patch(`/api/conversations/${id}/status`, data),
    delete:          (id)       => del(`/api/conversations/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Feedback  (/api/feedback)
────────────────────────────────────────────────────────────── */
export const feedbackApi = {
    create:  (data)     => post("/api/feedback", data),
    getAll:  (query="") => get(`/api/feedback${query ? `?${query}` : ""}`),
    getById: (id)       => get(`/api/feedback/${id}`),
    delete:  (id)       => del(`/api/feedback/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Notifications  (/api/notifications)
────────────────────────────────────────────────────────────── */
export const notificationApi = {
    create:      (data)     => post("/api/notifications", data),
    getAll:      (query="") => get(`/api/notifications${query ? `?${query}` : ""}`),
    markAsSent:  (id, data) => patch(`/api/notifications/${id}/sent`, data),
    markAsFailed:(id, data) => patch(`/api/notifications/${id}/failed`, data),
    delete:      (id)       => del(`/api/notifications/${id}`),
};

/* ──────────────────────────────────────────────────────────────
   Settings  (/api/settings)
────────────────────────────────────────────────────────────── */
export const settingApi = {
    get:              ()     => get("/api/settings"),
    createOrUpdate:   (data) => put("/api/settings", data),
    updateInvoice:    (data) => patch("/api/settings/invoice", data),
    updateWhatsApp:   (data) => patch("/api/settings/whatsapp", data),
    updatePayment:    (data) => patch("/api/settings/payment", data),
};

/* ──────────────────────────────────────────────────────────────
   Terms & Conditions  (/api/terms-and-conditions)
────────────────────────────────────────────────────────────── */
export const termsApi = {
    create:              (data)       => post("/api/terms-and-conditions", data),
    getAll:              (query="")   => get(`/api/terms-and-conditions${query ? `?${query}` : ""}`),
    getById:             (id)         => get(`/api/terms-and-conditions/${id}`),
    getActiveByCategory: (categoryId) => get(`/api/terms-and-conditions/category/${categoryId}/active`),
    update:              (id, data)   => patch(`/api/terms-and-conditions/${id}`, data),
    activate:            (id)         => patch(`/api/terms-and-conditions/${id}/activate`, {}),
};
