export const parseExpiration = (exp: string): number => {
  const unit = exp.slice(-1);
  const value = parseInt(exp.slice(0, -1));

  switch (unit) {
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    case 'm':
      return value * 60;
    default:
      return 3600;
  }
};
