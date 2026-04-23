export const getDisplayName = (fullName: string): string =>
  fullName.split(/[_]/)[0];
