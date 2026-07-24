const WIREMOCK_ADMIN =
  process.env.WIREMOCK_ADMIN_URL ?? 'http://localhost:8089/__admin';

export async function stubInsurer(status: number): Promise<void> {
  const reset = await fetch(`${WIREMOCK_ADMIN}/mappings/reset`, {
    method: 'POST',
  });
  if (!reset.ok) throw new Error(`WireMock reset failed with ${reset.status}`);

  const mapping = await fetch(`${WIREMOCK_ADMIN}/mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      request: { method: 'POST', urlPath: '/submit' },
      response: { status },
    }),
  });
  if (!mapping.ok)
    throw new Error(`WireMock mapping failed with ${mapping.status}`);
}
