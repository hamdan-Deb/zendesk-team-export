// option-2/export-console-data-to-csv.js
(() => {

  if (!window.ZENDESK_TEAM) {
    console.error("No data found. Run fetch script first.");
    return;
  }

  const textify = v => `="${v}"`;

  const headers = Object.keys(window.ZENDESK_TEAM[0]);

  const csv = [
    headers,
    ...window.ZENDESK_TEAM.map(u =>
      headers.map(h =>
        typeof u[h] === "string" ? textify(u[h]) : u[h]
      )
    )
  ]
    .map(r => r.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = `Zendesk_Team_${window.ZENDESK_TEAM.length}.csv`;

  document.body.appendChild(a);
  a.click();
  a.remove();

})();
