// option-1/export-and-download-csv.js
(async () => {

  const allUsers = [];
  const seen = new Set();

  const textify = v =>
    v === null || v === undefined || v === ""
      ? ""
      : `="${v}"`;

  for (const role of ["agent", "admin"]) {

    let url = `/api/v2/users.json?role[]=${role}&page[size]=100`;

    while (url) {

      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store"
      });

      const data = await res.json();

      for (const u of data.users) {

        if (seen.has(u.id)) continue;
        seen.add(u.id);

        allUsers.push({
          id: u.id,
          name: u.name || "",
          email: u.email || "",
          role: u.role || "",
          phone: u.phone || "",
          external_id: u.external_id || "",
          active: u.active,
          created_at: u.created_at || "",
          last_login_at: u.last_login_at || ""
        });
      }

      if (!data.meta?.has_more) break;
      url = data.links.next;
      await new Promise(r => setTimeout(r, 100));
    }
  }

  const headers = [
    "ID",
    "Name",
    "Email",
    "Role",
    "Phone",
    "External ID",
    "Active",
    "Created At",
    "Last Login"
  ];

  const csv = [
    headers,
    ...allUsers.map(u => [
      textify(u.id),
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      u.role,
      textify(u.phone),
      textify(u.external_id),
      u.active,
      u.created_at,
      u.last_login_at
    ])
  ]
    .map(r => r.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = `Zendesk_Team_${allUsers.length}.csv`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  console.log(`✅ Exported ${allUsers.length} team members`);
})();
