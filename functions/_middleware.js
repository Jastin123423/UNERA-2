
export async function onRequest({ next }) {
  try {
    return await next();
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Backend crash",
        message: err.message
      }),
      { status: 500 }
    );
  }
}
