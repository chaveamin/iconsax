export async function subscribeUser(_sub: any) {
  console.warn(
    "Push notifications require a server - not available in static export",
  );
  return { success: false };
}

export async function unsubscribeUser() {
  return { success: true };
}
