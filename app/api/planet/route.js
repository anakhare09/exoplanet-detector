const TAP_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

const COLUMNS = [
  "pl_name",
  "hostname",
  "disc_year",
  "discoverymethod",
  "disc_facility",
  "pl_orbper",
  "pl_rade",
  "pl_bmasse",
  "pl_eqt",
  "st_teff",
  "st_spectype",
  "sy_dist",
];

function buildQuery(name) {
  const escaped = name.replace(/'/g, "''");
  const adql =
    `select ${COLUMNS.join(",")} from pscomppars ` +
    `where pl_name like '%${escaped}%' order by pl_name`;
  return `${TAP_URL}?query=${encodeURIComponent(adql)}&format=json`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = (searchParams.get("name") || "").trim();

  if (!name || name.length < 2) {
    return Response.json({ error: "Type at least two characters of a planet's name." }, { status: 400 });
  }

  try {
    const res = await fetch(buildQuery(name), {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return Response.json(
        { error: "The NASA Exoplanet Archive couldn't be reached right now." },
        { status: 502 }
      );
    }

    const text = await res.text();
    let rows;
    try {
      rows = JSON.parse(text);
    } catch (e) {
      return Response.json(
        { error: "The archive returned something unexpected. Try a different spelling." },
        { status: 502 }
      );
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return Response.json({ results: [] });
    }

    return Response.json({ results: rows.slice(0, 8) });
  } catch (err) {
    return Response.json(
      { error: "Couldn't reach the NASA Exoplanet Archive. Check the connection and try again." },
      { status: 502 }
    );
  }
}
