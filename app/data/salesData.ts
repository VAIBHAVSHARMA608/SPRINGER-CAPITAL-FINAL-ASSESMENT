export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const sales2022 = months.map((m, i) => ({
  month: m,
  sales: [950, 1100, 1250, 1400, 1600, 1550, 1700, 1800, 1750, 1650, 1500, 1600][i],
}));

export const sales2023 = months.map((m, i) => ({
  month: m,
  sales: [1200, 1250, 1350, 1500, 1700, 1650, 1800, 1900, 1850, 1750, 1600, 1700][i],
}));

export const sales2024 = months.map((m, i) => ({
  month: m,
  sales: [1400, 1450, 1550, 1700, 1900, 1850, 2000, 2100, 2050, 1950, 1800, 1900][i],
}));

export default { sales2022, sales2023, sales2024 };
