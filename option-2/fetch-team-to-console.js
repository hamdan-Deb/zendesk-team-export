// option-2/fetch-team-to-console.js
(async () => {

  window.ZENDESK_TEAM = [];
  const seen = new Set();

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

        window.ZENDESK_TEAM.push({
          id: String(u.id),
          name: u.name || "",
          email: u.email || "",
          role: u.role || "",
          phone: String(u.phone || ""),
          external_id: String(u.external_id || ""),
          active: u.active
        });
      }

      if (!data.meta?.has_more) break;
      url = data.links.next;
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.table(window.ZENDESK_TEAM);
  console.log(`✅ Loaded ${window.ZENDESK_TEAM.length} users into window.ZENDESK_TEAM`);
})();
