export function generateModalId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}
