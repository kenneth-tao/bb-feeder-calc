// src/app/api/calculate-feeding/route.js

export async function POST(req) {
  // Parse the JSON body from the request
  const { ageRange, weight, feedsPerDay } = await req.json();

  const weightValue = parseFloat(weight);
  const feedsPerDayValue = parseInt(feedsPerDay, 10);

  if (!ageRange || isNaN(weightValue) || isNaN(feedsPerDayValue)) {
    return new Response(
      JSON.stringify({ error: "Please provide all required inputs" }),
      { status: 400 }
    );
  }

  // Feeding calculation logic
  const ageFactors = {
    newborn: 60,
    "<1-month": 180,
    "1-3-months": 150,
    "3-6-months": 120,
    "6-9-months": 100,
    "9-12-months": 90,
  };

  const factor = ageFactors[ageRange] || 0;
  const mlPerDay = factor * weightValue;
  const mlPerFeed = mlPerDay / feedsPerDayValue;

  return new Response(JSON.stringify({ mlPerDay, mlPerFeed }), { status: 200 });
}
