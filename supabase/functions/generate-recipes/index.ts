import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { ingredients, servings, cuisineFilter } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ingredientList = ingredients
      .map((i: { name: string; amount: string; unit: string }) => `${i.amount} ${i.unit} ${i.name}`)
      .join(", ");

    const cuisineInstruction = cuisineFilter
      ? `Only suggest recipes from ${cuisineFilter} cuisine.`
      : "Suggest recipes from diverse world cuisines.";

    const systemPrompt = `You are a world-class chef and recipe expert. Given a list of available ingredients with amounts, suggest 4-6 real recipes from around the world.

For each recipe, respond with a JSON array. Each recipe object must have:
- "name": recipe name
- "cuisine": country/cuisine type (e.g. "Italian", "Japanese", "Mexican", "Indian", "Thai", "French", "Korean", "Ethiopian", "Peruvian")
- "description": 1-2 sentence appetizing description
- "prepTime": estimated prep time in minutes
- "cookTime": estimated cook time in minutes
- "difficulty": "Easy", "Medium", or "Hard"
- "maxServings": maximum number of servings possible with the given ingredient amounts
- "requestedServings": ${servings}
- "hasEnoughIngredients": boolean - true if ingredients are sufficient for requested servings
- "missingOrShort": array of strings describing any ingredients that are missing or insufficient (empty array if all good)
- "ingredients": array of objects with "name", "amount", "unit" for the requested serving size
- "steps": array of step strings

${cuisineInstruction}

IMPORTANT: Only use REAL, well-known recipes. Scale ingredient amounts to the requested ${servings} servings. If the user doesn't have enough of an ingredient, include it in missingOrShort. Respond with ONLY a valid JSON array, no markdown, no explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `I have these ingredients: ${ingredientList}. I want to cook for ${servings} people.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "[]";

    // Parse the JSON from the AI response
    let recipes;
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      recipes = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error("Failed to parse AI response:", content);
      recipes = [];
    }

    return new Response(JSON.stringify({ recipes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-recipes error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
