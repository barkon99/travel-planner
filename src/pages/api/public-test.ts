export function GET() {
  return new Response(
    JSON.stringify({
      status: "success",
      message: "Publiczny endpoint działa!",
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
} 